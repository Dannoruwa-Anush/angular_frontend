import { BnplPlanNavComponent } from "../components/page_components/dashboard_components/nav_components/bnpl-plan-nav-component/bnpl-plan-nav-component";
import { BnplPlanTypeNavComponent } from "../components/page_components/dashboard_components/nav_components/bnpl-plan-type-nav-component/bnpl-plan-type-nav-component";
import { BrandNavComponent } from "../components/page_components/dashboard_components/nav_components/brand-nav-component/brand-nav-component";
import { CashflowNavComponent } from "../components/page_components/dashboard_components/nav_components/cashflow-nav-component/cashflow-nav-component";
import { CategoryNavComponent } from "../components/page_components/dashboard_components/nav_components/category-nav-component/category-nav-component";
import { CustomerNavComponent } from "../components/page_components/dashboard_components/nav_components/customer-nav-component/customer-nav-component";
import { CustomerOrderNavComponent } from "../components/page_components/dashboard_components/nav_components/customer-order-nav-component/customer-order-nav-component";
import { EmployeeNavComponent } from "../components/page_components/dashboard_components/nav_components/employee-nav-component/employee-nav-component";
import { InstallmentSnapshotNavComponent } from "../components/page_components/dashboard_components/nav_components/installment-snapshot-nav-component/installment-snapshot-nav-component";
import { ProductNavComponent } from "../components/page_components/dashboard_components/nav_components/product-nav-component/product-nav-component";
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
    //Employee
    {
        label: 'Employees',
        route: 'employee',
        component: EmployeeNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
        ]
    },
    //Customer
    {
        label: 'Customers',
        route: 'customer',
        component: CustomerNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
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
    {
        label: 'Electronic Products',
        route: 'e_product',
        component: ProductNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ]
    },
    //Bnpl_plan type
    {
        label: 'Bnpl Plan Types',
        route: 'bnpl_plan_type',
        component: BnplPlanTypeNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ]
    },
    //Orders
    {
        label: 'Orders',
        route: 'customer_order',
        component: CustomerOrderNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
            UserRoleEnum.Customer
        ]
    },
    //Payment (installment)

    //Bnpl_plan
    {
        label: 'Bnpl Plans',
        route: 'bnpl_plan',
        component: BnplPlanNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ]
    },
    //Bnpl_snapshots
    {
        label: 'Installment Snapshots',
        route: 'bnpl_installmet_snapshot',
        component: InstallmentSnapshotNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ]
    },
    //Cashflow
    {
        label: 'Cash Flows',
        route: 'cashflow',
        component: CashflowNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ]
    },
];
