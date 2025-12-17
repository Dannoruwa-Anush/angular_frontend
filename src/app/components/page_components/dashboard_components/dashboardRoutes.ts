import { Routes } from "@angular/router";
import { BaseDashboardComponent } from "./base-dashboard-component/base-dashboard-component";
import { DASHBOARD_NAV_ITEM_PERMISSIONS } from "../../../config/DashboardNavItemPermission";

export const DASHBOARD_ROUTES: Routes = [
    {
        // root dashboard route
        path: 'dashboard', component: BaseDashboardComponent,

        // dashboard nav routes
        children: [
            ...DASHBOARD_NAV_ITEM_PERMISSIONS.map(item => ({
                path: item.route,
                component: item.component,
            })),
        ]
    }
];