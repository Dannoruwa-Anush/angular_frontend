import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";
import { UserModel } from "./userModel";

export interface EmployeeModel{
    employeeID?: number;
    employeeName: string;
    position?: EmployeePositionEnum,

    //FK: Fields
    userResponseDto?: UserModel;
}