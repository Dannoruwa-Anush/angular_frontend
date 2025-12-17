import { Component, computed, OnInit, Signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { DashboardNavItemPermissionDataModel } from '../../../../models/ui_models/dashboardNavItemPermissionDataModel';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { DASHBOARD_NAV_ITEM_PERMISSIONS } from '../../../../config/DashboardNavItemPermission';

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

  constructor(
    private authSessionService: AuthSessionService
  ) {
    this.navItems = computed(() => {
      const role = this.authSessionService.role();
      if (!role) return [];

      return DASHBOARD_NAV_ITEM_PERMISSIONS.filter(item =>
        item.allowedRoles.includes(role)
      );
    });
  }
}
