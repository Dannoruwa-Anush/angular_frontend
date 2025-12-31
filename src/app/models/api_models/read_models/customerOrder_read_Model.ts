import { OrderPaymentStatusEnum } from "../../../config/enums/orderPaymentStatusEnum";
import { OrderStatusEnum } from "../../../config/enums/orderStatusEnum";
import { CustomerReadModel } from "./customer_read_Model";
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
    customerResponseDto?: CustomerReadModel;
    customerOrderElectronicItemResponseDto?: CustomerOrderElectronicItemsReadModel[];
}