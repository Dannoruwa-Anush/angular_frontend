import { RegisterRequestModel } from "../../core_api_models/auth_models/request_models/registerRequestModel";

export interface CustomerCreateModel {
    customerName: string;
    phoneNo: string;
    address: string;

    //FK: Fields 
    user: RegisterRequestModel;
}
