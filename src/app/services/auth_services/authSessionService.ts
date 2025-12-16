import { computed, effect, Injectable, signal } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { environment } from "../../config/environment";
import { AuthSessionModel } from "../../models/api_models/core_api_models/auth_models/authSessionModel";
import { LoginRequestModel } from "../../models/api_models/core_api_models/auth_models/request_models/loginRequestModel";
import { map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { RegisterRequestModel } from "../../models/api_models/core_api_models/auth_models/request_models/registerRequestModel";
import { Router } from "@angular/router";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";

const AUTH_KEY = 'auth_session';

@Injectable({
    providedIn: 'root',
})
export class AuthSessionService {


    private baseUrl = `${environment.BASE_API_URL.replace(/\/$/, '')}/api/auth`;

    // ---------- STATE ----------
    private session = signal<AuthSessionModel | null>(this.loadSession());

    // ---------- DERIVED ----------
    isLoggedIn = computed(() => !!this.session());
    token = computed(() => this.session()?.token ?? null);
    email = computed(() => this.session()?.email ?? null);
    role = computed(() => this.session()?.role ?? null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Persist session automatically
        effect(() => {
            const value = this.session();
            value
                ? localStorage.setItem(AUTH_KEY, JSON.stringify(value))
                : localStorage.removeItem(AUTH_KEY);
        });

        // Centralized role-based navigation
        effect(() => {
            const session = this.session();

            if (!session) {
                this.router.navigate(['/login']);
                return;
            }

            switch (session.role) {
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
        });
    }

    // ---------- PRIVATE ----------
    private loadSession(): AuthSessionModel | null {
        const data = localStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    }

    // ---------- API ----------
    login(payload: LoginRequestModel): Observable<AuthSessionModel> {
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
                    return session;
                })
            );
    }

    register(payload: RegisterRequestModel): Observable<void> {
        return this.http
            .post<ApiResponseModel<void>>(
                `${this.baseUrl}/register`,
                payload
            )
            .pipe(map(() => void 0));
    }

    logout(): void {
        this.session.set(null);
    }

    hasRole(allowed: UserRoleEnum[]): boolean {
        const role = this.role();
        return role ? allowed.includes(role) : false;
    }
}
