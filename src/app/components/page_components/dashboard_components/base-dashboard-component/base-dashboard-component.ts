import { Component, computed, Signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { DashboardNavItemPermissionDataModel } from '../../../../models/ui_models/dashboardNavItemPermissionDataModel';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { DASHBOARD_NAV_ITEM_PERMISSIONS } from '../../../../config/dashboardNavItemPermissions';
import { UserRoleEnum } from '../../../../config/enums/userRoleEnum';

@Component({
  selector: 'app-base-dashboard-component',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './base-dashboard-component.html',
  styleUrl: './base-dashboard-component.scss',
})
export class BaseDashboardComponent {

  navItems!: Signal<DashboardNavItemPermissionDataModel[]>;

  constructor(private auth: AuthSessionService) {

    this.navItems = computed(() => {
      const role = this.auth.role();
      if (!role) return [];

      return DASHBOARD_NAV_ITEM_PERMISSIONS.filter(item => {

        // Role must be allowed
        if (!item.allowedRoles.includes(role)) {
          return false;
        }

        // Admin bypass
        if (role === UserRoleEnum.Admin) {
          return true;
        }

        // Employee -> check employee position only if defined
        if (
          role === UserRoleEnum.Employee &&
          item.allowedEmployeePositions?.length
        ) {
          return this.auth.hasEmployeePosition(
            item.allowedEmployeePositions
          );
        }

        // Customer or other roles (no position restriction)
        return true;
      });
    });
  }
}
