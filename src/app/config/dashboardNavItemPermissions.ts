import { BnplInstallmetPaymentSimulatorNavComponent } from "../components/page_components/dashboard_components/nav_components/bnpl-installmet-payment-simulator-nav-component/bnpl-installmet-payment-simulator-nav-component";
import { BnplPlanNavComponent } from "../components/page_components/dashboard_components/nav_components/bnpl-plan-nav-component/bnpl-plan-nav-component";
import { BnplPlanTypeNavComponent } from "../components/page_components/dashboard_components/nav_components/bnpl-plan-type-nav-component/bnpl-plan-type-nav-component";
import { BrandNavComponent } from "../components/page_components/dashboard_components/nav_components/brand-nav-component/brand-nav-component";
import { CashflowNavComponent } from "../components/page_components/dashboard_components/nav_components/cashflow-nav-component/cashflow-nav-component";
import { CategoryNavComponent } from "../components/page_components/dashboard_components/nav_components/category-nav-component/category-nav-component";
import { CustomerNavComponent } from "../components/page_components/dashboard_components/nav_components/customer-nav-component/customer-nav-component";
import { CustomerOrderNavComponent } from "../components/page_components/dashboard_components/nav_components/customer-order-nav-component/customer-order-nav-component";
import { EmployeeNavComponent } from "../components/page_components/dashboard_components/nav_components/employee-nav-component/employee-nav-component";
import { InstallmentSnapshotNavComponent } from "../components/page_components/dashboard_components/nav_components/installment-snapshot-nav-component/installment-snapshot-nav-component";
import { InvoiceNavComponent } from "../components/page_components/dashboard_components/nav_components/invoice-nav-component/invoice-nav-component";
import { PhysicalShopSessionNavComponent } from "../components/page_components/dashboard_components/nav_components/physical-shop-session-nav-component/physical-shop-session-nav-component";
import { ProductNavComponent } from "../components/page_components/dashboard_components/nav_components/product-nav-component/product-nav-component";
import { ProfileNavComponent } from "../components/page_components/dashboard_components/nav_components/profile-nav-component/profile-nav-component";
import { DashboardNavItemPermissionDataModel } from "../models/ui_models/dashboardNavItemPermissionDataModel";
import { EmployeePositionEnum } from "./enums/employeePositionEnum";
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
    //Physical Shop Session
    {
        label: 'Physical Shop Session',
        route: 'physicalShopSession',
        icon: 'store',
        component: PhysicalShopSessionNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
        ]
    },
    //Employee
    {
        label: 'Employees',
        route: 'employee',
        icon: 'groups',
        component: EmployeeNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
        ]
    },
    //Customer
    {
        label: 'Customers',
        route: 'customer',
        icon: 'people',
        component: CustomerNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
        ]
    },
    //Brands nav
    {
        label: 'Brands',
        route: 'brand',
        icon: 'branding_watermark',
        component: BrandNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Categories nav
    {
        label: 'Categories',
        route: 'category',
        icon: 'category',
        component: CategoryNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Electronic Items
    {
        label: 'Electronic Products',
        route: 'e_product',
        icon: 'devices',
        component: ProductNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Bnpl_plan type
    {
        label: 'Bnpl Plan Types',
        route: 'bnpl_plan_type',
        icon: 'rule',
        component: BnplPlanTypeNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Orders
    {
        label: 'Orders',
        route: 'customer_order',
        icon: 'shopping_cart',
        component: CustomerOrderNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
            UserRoleEnum.Customer
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Bnpl_plan
    {
        label: 'Bnpl Plans',
        route: 'bnpl_plan',
        icon: 'schedule',
        component: BnplPlanNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Invoice
    {
        label: 'Invoices',
        route: 'invoice',
        icon: 'receipt_long',
        component: InvoiceNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
            UserRoleEnum.Customer
        ]
    },
    //Cashflow
    {
        label: 'Cash Flows',
        route: 'cashflow',
        icon: 'payments',
        component: CashflowNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ]
    },
    //Bnpl_snapshots
    {
        label: 'Installment Snapshots',
        route: 'bnpl_installmet_snapshot',
        icon: 'timeline',
        component: InstallmentSnapshotNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
    //Bnpl installmet payment simulator
    {
        label: 'Bnpl Payment Simulator',
        route: 'pay_simulator',
        icon: 'calculate',
        component: BnplInstallmetPaymentSimulatorNavComponent,
        allowedRoles: [
            UserRoleEnum.Admin,
            UserRoleEnum.Employee,
        ],
        allowedEmployeePositions: [
            EmployeePositionEnum.Manager
        ]
    },
];
