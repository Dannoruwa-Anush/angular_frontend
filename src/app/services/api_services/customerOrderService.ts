import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { CustomerOrderReadModel } from "../../models/api_models/read_models/customerOrder_read_Model";
import { CustomerOrderCreateModel } from "../../models/api_models/create_update_models/create_models/customerOrder_create_Model";
import { CustomerOrderUpdateModel } from "../../models/api_models/create_update_models/update_models/customerOrder_update_Model";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";

@Injectable({
    providedIn: 'root',
})
export class CustomerOrderService extends CrudService<CustomerOrderReadModel, CustomerOrderCreateModel, CustomerOrderUpdateModel> {

    protected endpoint = 'customerOrder';

    constructor(
        http: HttpClient,
        messageService: SystemMessageService
    ) {
        super(http, messageService);
    }

    // Override : pagination
    getCustomerOrderPaged(
        pageNumber: number,
        pageSize: number,
        paymentStatusId?: number,
        orderStatusId?: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            paymentStatusId,
            orderStatusId,
            searchKey
        });
    }

    // can add custom api methods here
    getByUser(id: number, customerId?: number): Observable<CustomerOrderReadModel> {
        this._loading.set(true);
        this.messageService.clear();

        let params: any = {};

        params.id = id;
        
        if (customerId !== undefined) {
            params.customerId = customerId;
        }

        return this.http
            .get<ApiResponseModel<CustomerOrderReadModel>>(
                `${this.baseUrl}/${this.endpoint}/bnpl`,
                { params }
            )
            .pipe(
                map(res => {
                    this._loading.set(false);
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}