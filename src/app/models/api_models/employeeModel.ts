import { EmployeePositionEnum } from "../../config/enums/employeePositionEnum";
import { UserReadModel } from "./read_models/user_read_Model";

export interface EmployeeModel {
    employeeID?: number;
    employeeName: string;
    position?: EmployeePositionEnum,
    createdAt?: string;
    updatedAt?: string;
    
    //FK: Fields
    user?: UserReadModel;
}