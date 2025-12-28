import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { CustomerReadModel } from "../../models/api_models/read_models/customer_read_Model";
import { CustomerCreateModel } from "../../models/api_models/create_update_models/create_models/customer_create_Model";
import { CustomerUpdateModel } from "../../models/api_models/create_update_models/update_models/customer_update_Model";

@Injectable({
    providedIn: 'root',
})
export class CustomerService extends CrudService<CustomerReadModel, CustomerCreateModel, CustomerUpdateModel> {

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
    getByUserId(id: number | string): Observable<CustomerReadModel> {
        this._loading.set(true);

        return this.http
            .get<ApiResponseModel<CustomerReadModel>>(`${this.baseUrl}/customer/user/${id}`)
            .pipe(
                map(res => {
                    this._loading.set(false);
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}
