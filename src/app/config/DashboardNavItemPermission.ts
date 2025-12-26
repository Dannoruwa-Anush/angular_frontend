import { BrandNavComponent } from "../components/page_components/dashboard_components/nav_components/brand-nav-component/brand-nav-component";
import { CategoryNavComponent } from "../components/page_components/dashboard_components/nav_components/category-nav-component/category-nav-component";
import { ProfileNavComponent } from "../components/page_components/dashboard_components/nav_components/profile-nav-component/profile-nav-component";
import { DashboardNavItemPermissionDataModel } from "../models/ui_models/dashboardNavItemPermissionDataModel";
import { UserRoleEnum } from "./enums/userRoleEnum";

export const DASHBOARD_NAV_ITEM_PERMISSIONS: DashboardNavItemPermissionDataModel[] = [
    //Profile nav
    {
        label: 'Profile',
        route: 'profile',
        icon: 'person',
        component: ProfileNavComponent,
        allowedRoles: [
            UserRoleEnum.Employee,
            UserRoleEnum.Customer
        ]
    },
    //Brands nav
    {
        label: 'Brands',
        route: 'brand',
        component: BrandNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ]
    },
    //Categories nav
    {
        label: 'Categories',
        route: 'category',
        component: CategoryNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ]
    },
    //Electronic Items

    //Employee

    //Customer

    //Orders

    //Cashflow

    //Bnpl_plan type

    //Bnpl_plan

    //Bnpl_installmets

    //Bnpl_snapshots
];
