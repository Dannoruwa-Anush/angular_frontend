import { Injectable } from "@angular/core";
import { environment } from "../../config/environment";
import { ElectronicItemReadModel } from "../../models/api_models/read_models/electronicItem_read_Model";
import { InvoiceReadModel } from "../../models/api_models/read_models/invoiceReadModel";
import { InvoiceStatusEnum } from "../../config/enums/invoiceStatusEnum";
import { CashflowReadModel } from "../../models/api_models/read_models/cashflow_read_model";
import { CashflowPaymentNatureEnum } from "../../config/enums/cashflowPaymentNatureEnum";

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

        const cashflow = invoice.cashflowResponseDtos?.at(-1);

        const normalize = (path?: string | null): string => {
            if (!path) return '';
            if (path.startsWith('http://') || path.startsWith('https://')) {
                return path; // already absolute
            }
            return `${this.baseUrl}/${path}`;
        };

        switch (invoice.invoiceStatus) {

            case InvoiceStatusEnum.Unpaid:
            case InvoiceStatusEnum.Voided:
                return normalize(invoice.invoiceFileUrl);

            case InvoiceStatusEnum.Paid:
                return normalize(cashflow?.paymentReceiptFileUrl);

            case InvoiceStatusEnum.Refunded:
                return normalize(cashflow?.refundReceiptFileUrl);

            default:
                return '';
        }
    }

    getCashflowReceiptFileUrl(cashflow: CashflowReadModel): string {
        if (!cashflow) return '';

        const normalize = (path?: string | null): string => {
            if (!path) return '';
            if (path.startsWith('http://') || path.startsWith('https://')) {
                return path;
            }
            return `${this.baseUrl}/${path}`;
        };

        switch (cashflow.cashflowPaymentNature) {

            case CashflowPaymentNatureEnum.Payment:
                return normalize(cashflow.paymentReceiptFileUrl);

            case CashflowPaymentNatureEnum.Refund:
                return normalize(cashflow.refundReceiptFileUrl);

            default:
                return '';
        }
    }
}
