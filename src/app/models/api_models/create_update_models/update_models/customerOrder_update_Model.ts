import { OrderStatusEnum } from "../../../../config/enums/orderStatusEnum";

export interface CustomerOrderUpdateModel {
    cancellationReason?: string;
    cancellationApproved?: boolean;
    cancellationRejectionReason?: string;
    newOrderStatus: OrderStatusEnum;
}