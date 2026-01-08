import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { InvoiceReadModel } from "../../models/api_models/read_models/invoiceReadModel";

@Injectable({
    providedIn: 'root',
})
export class InvoiceService extends CrudService<InvoiceReadModel, InvoiceReadModel, InvoiceReadModel> {

    protected endpoint = 'invoice';

    constructor(
        http: HttpClient,
        messageService: SystemMessageService
    ) {
        super(http, messageService);
    }

    // Override : pagination
    getInvoicePaged(
        pageNumber: number,
        pageSize: number,
        invoiceTypeId?: number,
        invoiceStatusId?: number,
        customerId?: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            invoiceTypeId,
            invoiceStatusId,
            customerId,
            searchKey
        });
    }
}
