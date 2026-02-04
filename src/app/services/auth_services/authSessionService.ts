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
import { PhysicalShopSessionService } from "../api_services/physicalShopSessionService";
import { InvoicePaymentChannelEnum } from "../../config/enums/invoicePaymentChannelEnum";

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

    // ---------- PHYSICAL SHOP SESSION STATE ----------
    shopSessionId = signal<number | null>(null);
    shopSessionOpenedAt = signal<string | null>(null);
    shopSessionIsActive = signal<boolean>(false);

    constructor(
        private http: HttpClient,
        private router: Router,
        private cartService: ShoppingCartService,
        private physicalShopSessionService: PhysicalShopSessionService,
        private messageService: SystemMessageService
    ) {

        // Persist session
        effect(() => {
            const value = this.session();
            value
                ? localStorage.setItem(AUTH_KEY, JSON.stringify(value))
                : localStorage.removeItem(AUTH_KEY);
        });

        // Reload shop session on page refresh (Admin / Employee only)
        effect(() => {
            const session = this.session();

            if (session && (session.role === UserRoleEnum.Admin || session.role === UserRoleEnum.Employee)) {
                this.loadActivePhysicalShopSession();
            }
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

    // --------- SHOP SESSION MUTATORS -----------------------
    setActiveShopSession(sessionId: number, openedAt: string) {
        this.shopSessionId.set(sessionId);
        this.shopSessionOpenedAt.set(openedAt);
        this.shopSessionIsActive.set(true);
    }

    clearShopSession() {
        this.shopSessionId.set(null);
        this.shopSessionOpenedAt.set(null);
        this.shopSessionIsActive.set(false);
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

                    //Get physical shop active session
                    if (session.role === UserRoleEnum.Admin || session.role === UserRoleEnum.Employee
                    ) {
                        this.loadActivePhysicalShopSession();
                    }

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

        // Clear shop session state
        this.clearShopSession();

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

    hasActiveShopSession = computed(() => this.shopSessionIsActive());

    private loadActivePhysicalShopSession(): void {
        if (this.shopSessionIsActive()) return;

        this.physicalShopSessionService.getLatestActive()
            .subscribe({
                next: session => {
                    this.setActiveShopSession(
                        session.physicalShopSessionID!,
                        session.openedAt ?? ''
                    );
                },
                error: () => this.clearShopSession()
            });
    }

    // ---------- CUSTOMER ORDER / SESSION HELPERS ----------
    canProceedOrderSubmissionWithPhysicalShopAction(): boolean {
        const role = this.role();
        const position = this.employeePosition();

        if (
            role === UserRoleEnum.Employee &&
            position === EmployeePositionEnum.Manager
        ) {
            if (!this.hasActiveShopSession()) {
                this.messageService.info(
                    'Unable to submit order: business session not opened.'
                );
                return false;
            }
        }

        return true;
    }

    // ---------- BNPL INSTALLMENT INVOICE HELPERS ----------
    canUseVisitingShopBnplInstallmentPayment(): boolean {
        const role = this.role();
        const position = this.employeePosition();

        // Only validate shop session for Employee -> Manager
        if (
            role === UserRoleEnum.Employee &&
            position === EmployeePositionEnum.Manager
        ) {
            return this.hasActiveShopSession();
        }

        // Other roles don't require shop session validation
        return true;
    }

    resolveBnplInstallmentInvoicePaymentChannel(): InvoicePaymentChannelEnum | null {
        // If customerID is NOT present -> Visiting shop
        if (!this.customerID()) {

            if (!this.canUseVisitingShopBnplInstallmentPayment()) {
                this.messageService.info(
                    'Unable to submit order: business session not opened.'
                );
                return null;
            }

            return InvoicePaymentChannelEnum.ByVisitingShop;
        }

        // Otherwise -> Online payment
        return InvoicePaymentChannelEnum.ByOnline;
    }
}
