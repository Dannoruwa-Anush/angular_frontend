import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { CustomerModel } from "../../models/api_models/customerModel";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";

@Injectable({
    providedIn: 'root',
})
export class CustomerService extends CrudService<CustomerModel, CustomerModel, CustomerModel> {

    protected endpoint = 'customer';

    constructor(
        http: HttpClient,
        messageService: SystemMessageService
    ) {
        super(http, messageService);
    }

    // Override : pagination
    getCustomerPaged(
        pageNumber: number,
        pageSize: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            searchKey
        });
    }

    // can add custom api methods here
    getByUserId(id: number | string): Observable<CustomerModel> {
        this._loading.set(true);

        return this.http
            .get<ApiResponseModel<CustomerModel>>(`${this.baseUrl}/customer/user/${id}`)
            .pipe(
                map(res => {
                    this._loading.set(false);
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}
