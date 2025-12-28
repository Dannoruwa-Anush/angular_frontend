import { UserReadModel } from "./read_models/user_read_Model";

export interface CustomerModel {
    customerID?: number;
    customerName: string;
    phoneNo: string;
    address: string;

    //FK: Fields
    userResponseDto?: UserReadModel;
}