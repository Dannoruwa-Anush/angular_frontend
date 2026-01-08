import { InvoiceStatusEnum } from "../../../config/enums/invoiceStatusEnum";
import { InvoiceTypeEnum } from "../../../config/enums/invoiceTypeEnum";

export interface invoiceReadModel {
    invoiceID: number;
    invoiceAmount: number;
    invoiceType: InvoiceTypeEnum;
    invoiceStatus: InvoiceStatusEnum;
    invoiceFileUrl: string;
}
