import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { CustomerReadModel } from "../../models/api_models/read_models/customer_read_Model";
import { CustomerCreateModel } from "../../models/api_models/create_update_models/create_models/customer_create_Model";
import { CustomerUpdateModel } from "../../models/api_models/create_update_models/update_models/customer_update_Model";
import { CustomerProfileUpdateModel } from "../../models/api_models/create_update_models/update_models/customerProfile_update_Model";

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

    // Override : update
    updateProfile(id: number | string, data: CustomerProfileUpdateModel): Observable<CustomerReadModel> {
        this._loading.set(true);
        this.messageService.clear();

        return this.http
            .put<ApiResponseModel<CustomerReadModel>>(`${this.baseUrl}/${this.endpoint}/profile/${id}`, data)
            .pipe(
                map(res => {
                    this._loading.set(false);
                    this.messageService.success(res.message || 'Profile updated successfully');
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }

    // can add custom api methods here
    getByUser(userId?: number, email?: string): Observable<CustomerReadModel> {
        this._loading.set(true);
        this.messageService.clear();

        let params: any = {};

        if (userId !== undefined) {
            params.userId = userId;
        } else if (email) {
            params.email = email;
        } else {
            throw new Error('Either userId or email must be provided');
        }

        return this.http
            .get<ApiResponseModel<CustomerReadModel>>(
                `${this.baseUrl}/${this.endpoint}/user`,
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
