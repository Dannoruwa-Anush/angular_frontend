import { ElectronicItemReadModel } from "./electronicItem_read_Model";

export interface CustomerOrderElectronicItemsReadModel {
    customerOrderID: number;
    orderItemID: number;
    quantity: number;
    unitPrice: number;
    subTotal: number;

    //FK: Fields
    electronicItemResponseDto?: ElectronicItemReadModel;
}
