import { RegisterRequestModel } from "../auth_models/request_models/registerRequestModel";

export interface CustomerRegisterRequestModel {
    customerName: string;
    phoneNo: string;
    address: string;

    //FK: Fields 
    user: RegisterRequestModel;
}
