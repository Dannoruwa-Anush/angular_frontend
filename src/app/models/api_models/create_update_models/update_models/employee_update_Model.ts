import { EmployeePositionEnum } from "../../../../config/enums/employeePositionEnum";

export interface EmployeeUpdateModel {
    employeeName: string;
    position: EmployeePositionEnum;
}
