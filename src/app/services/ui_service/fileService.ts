import { Injectable } from "@angular/core";
import { environment } from "../../config/environment";
import { ElectronicItemReadModel } from "../../models/api_models/read_models/electronicItem_read_Model";
import { InvoiceReadModel } from "../../models/api_models/read_models/invoiceReadModel";

@Injectable({ providedIn: 'root' })
export class FileService {
    
    // ---------- CONFIG ----------
    private baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

    getElectronicItemImage(item: ElectronicItemReadModel): string {
        if (item.electronicItemImageUrl) return item.electronicItemImageUrl;
        if (item.electronicItemImage) return `${this.baseUrl}/${item.electronicItemImage}`;
        return 'assets/images/no-image.png';
    }

    getInvoiceFileUrl(item: InvoiceReadModel): string {
        if (!item?.invoiceFileUrl) return '';
        return `${this.baseUrl}/${item.invoiceFileUrl}`;
    }
}
