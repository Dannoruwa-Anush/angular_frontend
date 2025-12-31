import { CustomerOrderElectronicItemsCreateModel } from "./customerOrderElectronicItems_create_Model";

export interface CustomerOrderCreateModel {
    customerID: number;

    //FK: Fields 
    customerOrderElectronicItems: CustomerOrderElectronicItemsCreateModel[];
}
