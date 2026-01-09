import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthSessionService } from "../../services/auth_services/authSessionService";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";
import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";
import { InvoiceService } from "../../services/api_services/invoiceService";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OrderSubmitGuard implements CanActivate {

    constructor(
        private auth: AuthSessionService,
        private invoiceService: InvoiceService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean | UrlTree> {

        // ---------- NOT LOGGED IN ----------
        if (!this.auth.isLoggedIn()) {
            return of(this.router.createUrlTree(['/login']));
        }

        const role = this.auth.role();
        const position = this.auth.employeePosition();

        // ---------- MANAGER (ALWAYS ALLOWED) ----------
        if (
            role === UserRoleEnum.Employee &&
            position === EmployeePositionEnum.Manager
        ) {
            return of(true);
        }

        // ---------- CUSTOMER (BUSINESS RULE CHECK) ----------
        if (role === UserRoleEnum.Customer) {
            const customerId = this.auth.customerID();

            if (!customerId) {
                return of(this.router.createUrlTree(['/']));
            }

            return this.invoiceService
                .isExistsUnpaidInvoiceByCustomerId(customerId)
                .pipe(
                    map(hasUnpaid => {
                        if (hasUnpaid) {
                            return this.router.createUrlTree(
                                ['/dashboard/invoice'],
                                { queryParams: { reason: 'unpaid' } }
                            );
                        }
                        return true;
                    }),
                    catchError(() =>
                        of(
                            this.router.createUrlTree(
                                ['/dashboard/invoice'],
                                { queryParams: { reason: 'unpaid' } }
                            )
                        )
                    )
                );
        }

        // ---------- EVERYTHING ELSE ----------
        return of(this.router.createUrlTree(['/']));
    }
}