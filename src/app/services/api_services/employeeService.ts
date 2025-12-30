import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { EmployeeCreateModel } from "../../models/api_models/create_update_models/create_models/employee_create_Model";
import { EmployeeUpdateModel } from "../../models/api_models/create_update_models/update_models/employee_update_Model";
import { EmployeeReadModel } from "../../models/api_models/read_models/employee_read_Model";
import { EmployeeProfileUpdateModel } from "../../models/api_models/create_update_models/update_models/employeeProfile_update_Model";

@Injectable({
    providedIn: 'root',
})
export class EmployeeService extends CrudService<EmployeeReadModel, EmployeeCreateModel, EmployeeUpdateModel> {

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

    // Override : update
    updateProfile(id: number | string, data: EmployeeProfileUpdateModel): Observable<EmployeeReadModel> {
        this._loading.set(true);
        this.messageService.clear();

        return this.http
            .put<ApiResponseModel<EmployeeReadModel>>(`${this.baseUrl}/${this.endpoint}/profile/${id}`, data)
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
    getByUserId(id: number | string): Observable<EmployeeReadModel> {
        this._loading.set(true);

        return this.http
            .get<ApiResponseModel<EmployeeReadModel>>(`${this.baseUrl}/${this.endpoint}/user/${id}`)
            .pipe(
                map(res => {
                    this._loading.set(false);
                    return res.data;
                }),
                catchError(err => this.handleHttpError(err))
            );
    }
}
