import { OrderPaymentStatusEnum } from "../../../config/enums/orderPaymentStatusEnum";
import { OrderStatusEnum } from "../../../config/enums/orderStatusEnum";
import { CustomerOrderElectronicItemsReadModel } from "./customerOrderElectronicItems_read_Model";

export interface CustomerOrderReadModel {
    orderID: number;
    totalAmount: number;
    orderDate: string;
    shippedDate?: string;
    deliveredDate?: string;
    cancelledDate?: string;
    orderStatus: OrderStatusEnum;
    paymentCompletedDate?: string;
    orderPaymentStatus: OrderPaymentStatusEnum;

    //FK: Fields
    customerOrderElectronicItemResponseDto?: CustomerOrderElectronicItemsReadModel;
}