import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthSessionService } from "../../services/auth_services/authSessionService";
import { catchError, Observable, throwError } from "rxjs";

// Task : attaches token
export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authSession = inject(AuthSessionService);
    const token = authSession.token();

    // Attach token if it exists (backend decides if required)
    const authReq = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 403) {
                authSession.logout();
            }
            return throwError(() => err);
        })
    );
};