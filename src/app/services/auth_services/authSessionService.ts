import { computed, effect, Injectable, signal } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { environment } from "../../config/environment";
import { AuthSessionModel } from "../../models/api_models/core_api_models/auth_models/authSessionModel";
import { LoginRequestModel } from "../../models/api_models/core_api_models/auth_models/request_models/loginRequestModel";
import { catchError, EMPTY, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { RegisterRequestModel } from "../../models/api_models/core_api_models/auth_models/request_models/registerRequestModel";
import { Router } from "@angular/router";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";
import { ShoppingCartService } from "../ui_service/shoppingCartService";

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

    constructor(
        private http: HttpClient,
        private router: Router,
        private cartService: ShoppingCartService
    ) {

        // Persist session
        effect(() => {
            const value = this.session();
            value
                ? localStorage.setItem(AUTH_KEY, JSON.stringify(value))
                : localStorage.removeItem(AUTH_KEY);
        });

        // Navigate AFTER login/logout only
        effect(() => {
            if (!this.session()) return;
            this.navigateByRole(this.session()!.role);
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

    // ---------- API ----------
    login(payload: LoginRequestModel): Observable<AuthSessionModel> {
        this.loading.set(true);
        this.error.set(null);

        return this.http
            .post<ApiResponseModel<any>>(`${this.baseUrl}/login`, payload)
            .pipe(
                map(res => {
                    const session: AuthSessionModel = {
                        token: res.data.token,
                        email: res.data.email,
                        role: res.data.role as UserRoleEnum
                    };
                    this.session.set(session);
                    this.loading.set(false);
                    return session;
                }),
                catchError(() => {
                    this.loading.set(false);
                    this.error.set('Invalid email or password');
                    return EMPTY;
                })
            );
    }

    register(payload: RegisterRequestModel): Observable<void> {
        this.loading.set(true);
        this.error.set(null);

        return this.http
            .post<ApiResponseModel<void>>(`${this.baseUrl}/register`, payload)
            .pipe(
                map(() => {
                    this.loading.set(false);
                }),
                catchError(() => {
                    this.loading.set(false);
                    this.error.set('Registration failed');
                    return EMPTY;
                })
            );
    }

    logout(): void {
        this.cartService.clearCart();
        this.session.set(null);
        this.router.navigate(['/login']);
    }

    hasRole(allowed: UserRoleEnum[]): boolean {
        const role = this.role();
        return role !== null && allowed.includes(role);
    }
}
