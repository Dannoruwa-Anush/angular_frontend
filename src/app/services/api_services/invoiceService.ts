import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { InvoiceReadModel } from "../../models/api_models/read_models/invoiceReadModel";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";

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

    // can add custom api methods here
    isExistsUnpaidInvoiceByCustomerId(customerId: number | string): Observable<boolean> {
        this._loading.set(true);

        return this.http
            .get<ApiResponseModel<boolean>>(`${this.baseUrl}/${this.endpoint}/customer/${customerId}`)
            .pipe(
                map(res => {
                    this._loading.set(false);
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}
