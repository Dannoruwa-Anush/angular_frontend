import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { InvoiceReadModel } from "../../models/api_models/read_models/invoiceReadModel";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { BnplSnapShotPayingSimulationCreateModel } from "../../models/api_models/create_update_models/create_models/bnplSnapShotPayingSimulation_create_Model";

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
        orderSourceId?: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            invoiceTypeId,
            invoiceStatusId,
            customerId,
            orderSourceId,
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

    generateSettlementInvoice(data: BnplSnapShotPayingSimulationCreateModel): Observable<InvoiceReadModel> {

        this._loading.set(true);
        this.messageService.clear();

        return this.http
            .post<ApiResponseModel<InvoiceReadModel>>(
                `${this.baseUrl}/${this.endpoint}/generate/settlement`,
                data
            )
            .pipe(
                map(res => {
                    this._loading.set(false);
                    this.messageService.success(
                        res.message || 'Settlement invoice generated'
                    );
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }

    cancelInvoice(id: number | string): Observable<InvoiceReadModel> {
        this._loading.set(true);
        this.messageService.clear();

        return this.http
            .put<ApiResponseModel<InvoiceReadModel>>(
                `${this.baseUrl}/${this.endpoint}/${id}`,
                null
            )
            .pipe(
                map(res => {
                    this._loading.set(false);
                    this.messageService.success(
                        res.message || 'Invoice cancelled successfully'
                    );
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}
