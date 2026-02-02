import { CashflowPaymentNatureEnum } from "../../../config/enums/cashflowPaymentNatureEnum";
import { CustomerOrderReadModel } from "./customerOrder_read_Model";

export interface CashflowReadModel {
    cashflowID: number;
    amountPaid: string;
    cashflowRef: string;
    cashflowDate: string;
    cashflowPaymentNature: CashflowPaymentNatureEnum;
    paymentReceiptFileUrl?: string;
    refundReceiptFileUrl?: string;

    refundDate?: string;

    // Fk : fields
    customerOrderResponseDto?: CustomerOrderReadModel;
}