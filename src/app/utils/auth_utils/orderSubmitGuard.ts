import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthSessionService } from "../../services/auth_services/authSessionService";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";
import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";

@Injectable({ providedIn: 'root' })
export class OrderSubmitGuard implements CanActivate {

    constructor(
        private auth: AuthSessionService,
        private router: Router
    ) { }

    canActivate(): boolean {

        // Not logged in
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }

        const role = this.auth.role();
        const position = this.auth.employeePosition();

        // Customer allowed
        if (role === UserRoleEnum.Customer) {
            return true;
        }

        // Employee allowed ONLY if Manager
        if (
            role === UserRoleEnum.Employee &&
            position === EmployeePositionEnum.Manager
        ) {
            return true;
        }

        // Everything else blocked
        this.router.navigate(['/']);
        return false;
    }
}