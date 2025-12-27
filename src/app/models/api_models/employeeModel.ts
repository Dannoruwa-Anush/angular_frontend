import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";
import { UserModel } from "./userModel";

export interface EmployeeModel {
    employeeID?: number;
    employeeName: string;
    position?: EmployeePositionEnum,
    createdAt?: string;
    updatedAt?: string;
    
    //FK: Fields
    userResponseDto?: UserModel;
}