import { EmployeePositionEnum } from "../../../../config/enums/employeePositionEnum";
import { RegisterRequestModel } from "../../core_api_models/auth_models/request_models/registerRequestModel";

export interface EmployeeCreateModel {
    employeeName: string;
    position: EmployeePositionEnum;

    //FK: Fields 
    user: RegisterRequestModel;
}
