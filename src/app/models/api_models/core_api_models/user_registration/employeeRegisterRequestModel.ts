import { EmployeePositionEnum } from "../../../../config/enums/employeePositionEnum";
import { RegisterRequestModel } from "../auth_models/request_models/registerRequestModel";

export interface EmployeeRegisterRequestModel {
    employeeName: string;
    position: EmployeePositionEnum;

    //FK: Fields 
    user: RegisterRequestModel;
}
