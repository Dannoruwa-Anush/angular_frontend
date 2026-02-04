import { InvoicePaymentChannelEnum } from "../../../../config/enums/invoicePaymentChannelEnum";

export interface BnplSnapshotPayingInvoiceGenerationCreateModel {
    orderId: number;
    paymentAmount: number;
    invoicePaymentChannel: InvoicePaymentChannelEnum;
}
