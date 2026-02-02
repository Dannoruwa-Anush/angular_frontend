import { OrderPaymentModeEnum } from "../../../../config/enums/orderPaymentModeEnum";
import { OrderSourceEnum } from "../../../../config/enums/orderSourceEnum";
import { CustomerOrderElectronicItemsCreateModel } from "./customerOrderElectronicItems_create_Model";

export interface CustomerOrderCreateModel {

    orderSource: OrderSourceEnum;
    orderPaymentMode: OrderPaymentModeEnum;

    //FK: Fields 
    customerOrderElectronicItems: CustomerOrderElectronicItemsCreateModel[];

    physicalShopSessionId?: number;

    // Used ONLY when OrderSource == PhysicalShop
    physicalShopBillToCustomerID?: number;

    //Bnpl fields
    bnpl_PlanTypeID?: number;
    bnpl_InstallmentCount?: number;
    bnpl_InitialPayment?: number;
}
