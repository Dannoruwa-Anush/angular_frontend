import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthSessionService } from "../../services/auth_services/authSessionService";
import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";

@Injectable({ providedIn: 'root' })
export class EmployeePositionGuard implements CanActivate {

  constructor(
    private auth: AuthSessionService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const positions = route.data['positions'] as EmployeePositionEnum[] | undefined;

    // No position restriction → allow
    if (!positions || positions.length === 0) {
      return true;
    }

    // Admin bypass
    if (this.auth.role() === UserRoleEnum.Admin) {
      return true;
    }

    // Must be employee
    if (this.auth.role() !== UserRoleEnum.Employee) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Check position
    if (!this.auth.hasEmployeePosition(positions)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}