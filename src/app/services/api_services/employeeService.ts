import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { EmployeeModel } from "../../models/api_models/employeeModel";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { CustomerModel } from "../../models/api_models/customerModel";

@Injectable({
    providedIn: 'root',
})
export class EmployeeService extends CrudService<EmployeeModel> {

    protected endpoint = 'employee';

    constructor(
        http: HttpClient,
        messageService: SystemMessageService
    ) {
        super(http, messageService);
    }

    // Override : pagination
    getEmployeePaged(
        pageNumber: number,
        pageSize: number,
        positionId?: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            positionId,
            searchKey
        });
    }

    // can add custom api methods here
    getByUserId(id: number | string): Observable<EmployeeModel> {
        this._loading.set(true);

        return this.http
            .get<ApiResponseModel<EmployeeModel>>(`${this.baseUrl}/employee/user/${id}`)
            .pipe(
                map(res => {
                    this._loading.set(false);
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}
