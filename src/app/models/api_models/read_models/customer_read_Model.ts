import { UserReadModel } from "./user_read_Model";

export interface CustomerReadModel {
    customerID: number;
    customerName: string;
    phoneNo: string;
    address: string;

    //FK: Fields
    userResponseDto?: UserReadModel;
}