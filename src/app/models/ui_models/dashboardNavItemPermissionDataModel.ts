import { Type } from "@angular/core";
import { UserRoleEnum } from "../../config/enums/userRoleEnum";
import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";

export interface DashboardNavItemPermissionDataModel {
    label: string;
    route: string;
    icon?: string;         // material icon name
    component: Type<any>;
    allowedRoles: UserRoleEnum[]; 

    allowedEmployeePositions?: EmployeePositionEnum[];
}