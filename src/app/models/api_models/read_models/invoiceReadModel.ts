import { InvoiceStatusEnum } from "../../../config/enums/invoiceStatusEnum";
import { InvoiceTypeEnum } from "../../../config/enums/invoiceTypeEnum";
import { CashflowReadModel } from "./cashflow_read_model";

export interface InvoiceReadModel {
    invoiceID: number;
    invoiceAmount: number;
    invoiceType: InvoiceTypeEnum;
    invoiceStatus: InvoiceStatusEnum;
    invoiceFileUrl?: string;

    //FK fields
    cashflowResponseDtos?: CashflowReadModel[];
}
