import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthSessionService } from "../../services/auth_services/authSessionService";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";
import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";
import { InvoiceService } from "../../services/api_services/invoiceService";
import { catchError, map, Observable, of } from "rxjs";
import { SystemMessageService } from "../../services/ui_service/systemMessageService";

@Injectable({ providedIn: 'root' })
export class OrderSubmitGuard implements CanActivate {

    constructor(
        private auth: AuthSessionService,
        private invoiceService: InvoiceService,
        private router: Router,
        private messageService: SystemMessageService
    ) { }

    canActivate(): Observable<boolean | UrlTree> {

        // ---------- NOT LOGGED IN ----------
        if (!this.auth.isLoggedIn()) {
            this.messageService.info('Please log in to proceed with checkout');

            return of(
                this.router.createUrlTree(
                    ['/login'],
                    { queryParams: { redirect: '/submit_order' } }
                )
            );
        }

        const role = this.auth.role();
        const position = this.auth.employeePosition();

        // ---------- MANAGER (REQUIRES ACTIVE SHOP SESSION) ----------
        if (
            role === UserRoleEnum.Employee &&
            position === EmployeePositionEnum.Manager
        ) {
            if (!this.auth.hasActiveShopSession()) {
                this.messageService.info(
                    'Unable to submit order: business session not opened.'
                );

                return of(
                    this.router.createUrlTree(['/dashboard'])
                );
            }

            return of(true);
        }

        // ---------- CUSTOMER (BUSINESS RULE CHECK) ----------
        if (role === UserRoleEnum.Customer) {
            const customerId = this.auth.customerID();

            // Defensive fallback
            if (!customerId) {
                return of(this.router.createUrlTree(['/']));
            }

            return this.invoiceService
                .isExistsUnpaidInvoiceByCustomerId(customerId)
                .pipe(
                    map(hasUnpaidInvoice => {
                        if (hasUnpaidInvoice) {
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

        // ---------- EVERYTHING ELSE: BLOCK----------
        return of(this.router.createUrlTree(['/']));
    }
}