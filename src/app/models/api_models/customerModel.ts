import { UserModel } from "./userModel";

export interface CustomerModel {
    customerID?: number;
    customerName: string;
    phoneNo: string;
    address: string;

    //FK: Fields
    userResponseDto?: UserModel;
}