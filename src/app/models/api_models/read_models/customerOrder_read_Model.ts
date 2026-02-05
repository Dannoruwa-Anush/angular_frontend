import { OrderPaymentStatusEnum } from "../../../config/enums/orderPaymentStatusEnum";
import { OrderStatusEnum } from "../../../config/enums/orderStatusEnum";
import { CustomerReadModel } from "./customer_read_Model";
import { CustomerOrderElectronicItemsReadModel } from "./customerOrderElectronicItems_read_Model";
import { InvoiceReadModel } from "./invoiceReadModel";

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
    isFreeTrialOver: boolean;

    //FK: Fields
    customerResponseDto?: CustomerReadModel;
    customerOrderElectronicItemResponseDto: CustomerOrderElectronicItemsReadModel[];
    latestUnpaidInvoice?: InvoiceReadModel;
}