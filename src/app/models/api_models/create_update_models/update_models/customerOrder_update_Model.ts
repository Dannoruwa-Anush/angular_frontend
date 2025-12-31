import { OrderStatusEnum } from "../../../../config/enums/orderStatusEnum";

export interface CustomerOrderUpdateModel {
    newOrderStatus: OrderStatusEnum;
}