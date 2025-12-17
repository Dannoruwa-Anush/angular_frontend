import { Routes } from "@angular/router";
import { BaseDashboardComponent } from "./base-dashboard-component/base-dashboard-component";
import { RoleGuard } from "../../../util/roleGuard";
import { UserRoleEnum } from "../../../config/enums/userRoleEnum";
import { DASHBOARD_NAV_ITEM_PERMISSIONS } from "../../../config/DashboardNavItemPermission";

export const DASHBOARD_ROUTES: Routes = [
  {
    // root dashboard route
    path: 'dashboard',
    component: BaseDashboardComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [
        UserRoleEnum.Admin,
        UserRoleEnum.Employee,
        UserRoleEnum.Customer
      ]
    },
    // Nav routes
    children: DASHBOARD_NAV_ITEM_PERMISSIONS.map(item => ({
      path: item.route,
      component: item.component,
      canActivate: [RoleGuard],
      data: {
        roles: item.allowedRoles
      }
    }))
  }
];