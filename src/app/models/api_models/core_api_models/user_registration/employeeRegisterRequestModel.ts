import { RegisterRequestModel } from "../auth_models/request_models/registerRequestModel";

export interface EmployeeRegisterRequestModel {
    customerName: string;
    phoneNo: string;
    address: string;

    //FK: Fields 
    user: RegisterRequestModel;
}
