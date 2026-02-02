import { Injectable } from "@angular/core";
import { environment } from "../../config/environment";
import { ElectronicItemReadModel } from "../../models/api_models/read_models/electronicItem_read_Model";
import { InvoiceReadModel } from "../../models/api_models/read_models/invoiceReadModel";
import { InvoiceStatusEnum } from "../../config/enums/invoiceStatusEnum";

@Injectable({ providedIn: 'root' })
export class FileService {

    // ---------- CONFIG ----------
    private baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

    getElectronicItemImage(item: ElectronicItemReadModel): string {
        if (item.electronicItemImageUrl) return item.electronicItemImageUrl;
        if (item.electronicItemImage) return `${this.baseUrl}/${item.electronicItemImage}`;
        return 'assets/images/no-image.png';
    }


    // ---------- INVOICE / RECEIPT ----------
    getInvoiceFileUrl(invoice: InvoiceReadModel): string {
        if (!invoice) return '';

        const cashflow = invoice.cashflowResponseDtos?.at(-1); // latest cashflow

        switch (invoice.invoiceStatus) {

            case InvoiceStatusEnum.Unpaid:
            case InvoiceStatusEnum.Voided:
                return invoice.invoiceFileUrl
                    ? `${this.baseUrl}/${invoice.invoiceFileUrl}`
                    : '';

            case InvoiceStatusEnum.Paid:
                return cashflow?.paymentReceiptFileUrl
                    ? `${this.baseUrl}/${cashflow.paymentReceiptFileUrl}`
                    : '';

            case InvoiceStatusEnum.Refunded:
                return cashflow?.refundReceiptFileUrl
                    ? `${this.baseUrl}/${cashflow.refundReceiptFileUrl}`
                    : '';

            default:
                return '';
        }
    }
}
