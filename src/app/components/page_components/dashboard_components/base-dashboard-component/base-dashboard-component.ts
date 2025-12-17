import { Component, OnInit } from '@angular/core';

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
export class BaseDashboardComponent implements OnInit {

  navItemPermission: DashboardNavItemPermissionDataModel[] = [];

  constructor(
    private authSessionService: AuthSessionService,
  ) { }

  ngOnInit(): void {
    const role = this.authSessionService.role(); 

    if (!role) {
      this.navItemPermission = [];
      return;
    }

    this.navItemPermission = DASHBOARD_NAV_ITEM_PERMISSIONS.filter(
      item => item.allowedRoles.includes(role)
    );
  }
}
