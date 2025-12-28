import { EmployeePositionEnum } from "../../../config/enums/employeePositionEnum";
import { UserReadModel } from "./user_read_Model";

export interface EmployeeReadModel {
    employeeID: number;
    employeeName: string;
    position: EmployeePositionEnum,
    createdAt?: string;
    updatedAt?: string;
    
    //FK: Fields
    user?: UserReadModel;
}