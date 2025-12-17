import { Routes } from "@angular/router";
import { BaseDashboardComponent } from "./base-dashboard-component/base-dashboard-component";

export const DASHBOARD_ROUTES: Routes = [
    {
        //root dashboard route
        path: 'dashboard', component: BaseDashboardComponent, 
    }
];