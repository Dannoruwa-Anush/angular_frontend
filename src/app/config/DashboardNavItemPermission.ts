import { ProfileNavComponent } from "../components/page_components/dashboard_components/nav_components/profile-nav-component/profile-nav-component";
import { BrandNavComponent } from "../components/page_components/dashboard_components/nav_components/brand-nav-component/brand-nav-component";
import { DashboardNavItemPermissionDataModel } from "../models/ui_models/dashboardNavItemPermissionDataModel";
import { UserRoleEnum } from "./enums/userRoleEnum";

export const DASHBOARD_NAV_ITEM_PERMISSIONS: DashboardNavItemPermissionDataModel[] = [ 
    { label: 'Profile', route: 'profile', icon: 'person', component: ProfileNavComponent, allowedRoles: [UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Customer] },
    { label: 'Brands', route: 'brand',                    component: BrandNavComponent, allowedRoles: [UserRoleEnum.Admin, UserRoleEnum.Employee] },
];