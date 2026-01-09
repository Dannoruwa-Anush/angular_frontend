import { computed, effect, Injectable, signal } from "@angular/core";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../config/environment";
import { AuthSessionModel } from "../../models/api_models/core_api_models/auth_models/authSessionModel";
import { LoginRequestModel } from "../../models/api_models/core_api_models/auth_models/request_models/loginRequestModel";
import { catchError, EMPTY, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { RegisterRequestModel } from "../../models/api_models/core_api_models/auth_models/request_models/registerRequestModel";
import { Router } from "@angular/router";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";
import { ShoppingCartService } from "../ui_service/shoppingCartService";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";

const AUTH_KEY = 'auth_session';

@Injectable({
    providedIn: 'root',
})
export class AuthSessionService {


    private baseUrl = `${environment.BASE_API_URL.replace(/\/$/, '')}/api/auth`;

    // ---------- STATE ----------
    private session = signal<AuthSessionModel | null>(this.loadSession());
    loading = signal(false);
    error = signal<string | null>(null);

    // ---------- DERIVED ----------
    isLoggedIn = computed(() => !!this.session());
    token = computed(() => this.session()?.token ?? null);
    email = computed(() => this.session()?.email ?? null);
    role = computed(() => this.session()?.role ?? null);
    userID = computed(() => this.session()?.userID ?? null);
    customerID = computed(() => this.session()?.customerID ?? null);
    employeePosition = computed(() => this.session()?.employeePosition ?? null);

    constructor(
        private http: HttpClient,
        private router: Router,
        private cartService: ShoppingCartService,
        private messageService: SystemMessageService
    ) {

        // Persist session
        effect(() => {
            const value = this.session();
            value
                ? localStorage.setItem(AUTH_KEY, JSON.stringify(value))
                : localStorage.removeItem(AUTH_KEY);
        });
    }

    // ---------- PRIVATE ----------
    private loadSession(): AuthSessionModel | null {
        const data = localStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    }

    private navigateByRole(role: UserRoleEnum): void {
        switch (role) {
            case UserRoleEnum.Admin:
            case UserRoleEnum.Employee:
                this.router.navigate(['/dashboard']);
                break;
            case UserRoleEnum.Customer:
                this.router.navigate(['/']);
                break;
            default:
                this.router.navigate(['/login']);
        }
    }

    private navigateAfterLogin(role: UserRoleEnum): void {
        const redirect =
            this.router.parseUrl(this.router.url).queryParams['redirect'];

        if (redirect) {
            this.router.navigateByUrl(redirect);
            return;
        }

        this.navigateByRole(role);
    }

    // ---------- API ----------
    // LOGIN
    login(payload: LoginRequestModel): Observable<AuthSessionModel> {
        this.loading.set(true);
        this.messageService.clear();

        return this.http
            .post<ApiResponseModel<any>>(`${this.baseUrl}/login`, payload)
            .pipe(
                map(res => {
                    const session: AuthSessionModel = {
                        token: res.data.token,
                        email: res.data.email,
                        role: res.data.role,
                        userID: res.data.userID,

                        // If the user is an employee or a customer
                        employeePosition: res.data.employeePosition ?? null,
                        customerID: res.data.customerID ?? null
                    };

                    this.session.set(session);
                    this.loading.set(false);

                    // SUCCESS MESSAGE FROM API
                    this.messageService.success(res.message || 'Login successful');

                    // Redirect-aware navigation
                    this.navigateAfterLogin(session.role);

                    return session;
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loading.set(false);

                    // ERROR MESSAGE FROM API
                    this.messageService.error(
                        err.error?.message ?? 'Invalid email or password'
                    );

                    return EMPTY;
                })
            );
    }

    // REGISTER
    register(payload: RegisterRequestModel): Observable<void> {
        this.loading.set(true);
        this.messageService.clear();

        return this.http
            .post<ApiResponseModel<void>>(`${this.baseUrl}/register`, payload)
            .pipe(
                map(res => {
                    this.loading.set(false);

                    // SUCCESS MESSAGE
                    this.messageService.success(
                        res.message || 'Registration successful'
                    );

                    this.router.navigate(['/login']);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loading.set(false);

                    // ERROR MESSAGE FROM API
                    this.messageService.error(
                        err.error?.message ?? 'Registration failed'
                    );

                    return EMPTY;
                })
            );
    }

    // LOGOUT
    logout(): void {
        // ALWAYS unlock cart on logout
        this.cartService.unlockCart();
        this.cartService.clearCart();

        this.session.set(null);
        this.router.navigate(['/login']);
    }

    // ---------- helper methods ----------
    hasRole(roles: UserRoleEnum[]): boolean {
        const role = this.role();
        return role !== null && roles.includes(role);
    }

    hasEmployeePosition(positions: EmployeePositionEnum[]): boolean {
        const position = this.employeePosition();
        return position !== null && positions.includes(position);
    }
}
