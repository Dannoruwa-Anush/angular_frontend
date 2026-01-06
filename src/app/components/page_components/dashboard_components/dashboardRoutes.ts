import { Routes } from "@angular/router";
import { BaseDashboardComponent } from "./base-dashboard-component/base-dashboard-component";
import { RoleGuard } from "../../../utils/auth_utils/roleGuard";
import { UserRoleEnum } from "../../../config/enums/userRoleEnum";
import { DASHBOARD_NAV_ITEM_PERMISSIONS } from "../../../config/dashboardNavItemPermission";
import { EmployeePositionGuard } from "../../../utils/auth_utils/employeePositionGuard";

export const DASHBOARD_ROUTES: Routes = [
  {
    // root dashboard route: allowed for all roles
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
    // Nav routes: based on role or employee position
    children: DASHBOARD_NAV_ITEM_PERMISSIONS.map(item => ({
      path: item.route,
      component: item.component,
      canActivate: [RoleGuard, EmployeePositionGuard],
      data: {
        roles: item.allowedRoles,
        positions: item.allowedEmployeePositions 
      }
    }))
  }
];