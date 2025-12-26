import { UserModel } from "./userModel";

export interface CustomerModel {
    customerID?: number;
    customerName: string;
    email: string;
    phoneNo: string;
    address: string;

    //FK: Fields
    userResponseDto?: UserModel;
}