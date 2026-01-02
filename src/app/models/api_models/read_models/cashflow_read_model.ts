import { CashflowStatusEnum } from "../../../config/enums/cashflowStatusEnum";
import { CustomerOrderReadModel } from "./customerOrder_read_Model";

export interface CashflowReadModel {
    cashflowID: number;
    amountPaid: string;
    cashflowRef: string;
    cashflowDate: string;
    refundDate?: string;
    cashflowStatus: CashflowStatusEnum;

    // Fk : fields
    customerOrderResponseDto?: CustomerOrderReadModel;
}