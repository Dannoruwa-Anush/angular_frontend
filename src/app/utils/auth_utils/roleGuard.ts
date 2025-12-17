import { Injectable } from "@angular/core";

import { AuthSessionService } from "../../services/auth_services/authSessionService";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";

@Injectable({ providedIn: 'root' })
export class RoleGuard {

  constructor(
    private authSessionService: AuthSessionService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as UserRoleEnum[] | undefined;
    const role = this.authSessionService.role();

    // Not logged in
    if (!this.authSessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // No role config : deny by default (unauthorized)
    if (!allowedRoles || allowedRoles.length === 0) {
      this.router.navigate(['/']);
      return false;
    }

    // Role not allowed (unauthorized)
    if (!role || !allowedRoles.includes(role)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
