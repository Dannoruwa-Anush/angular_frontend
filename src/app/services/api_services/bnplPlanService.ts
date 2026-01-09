import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BnplPlanReadModel } from "../../models/api_models/read_models/bnpl_plan_read_model";
import { CrudService } from "./core_services/crud-service";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { BnplPlanInstallmentCalculatorCreateModel } from "../../models/api_models/create_update_models/create_models/bnplInstallmentCalculator_create_Model";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";
import { catchError, map } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class BnplPlanService extends CrudService<BnplPlanReadModel, BnplPlanReadModel, BnplPlanReadModel> {

    protected endpoint = 'BNPL_Plan';

    constructor(
        http: HttpClient,
        messageService: SystemMessageService
    ) {
        super(http, messageService);
    }

    // Override : pagination
    getBnplPlanPaged(
        pageNumber: number,
        pageSize: number,
        planStatusId?: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            planStatusId,
            searchKey
        });
    }

    // can add custom api methods here
    calculateBnplPlanInstallment(
        data: BnplPlanInstallmentCalculatorCreateModel
    ) {
        this._loading.set(true);
        this.messageService.clear();

        return this.http
            .post<ApiResponseModel<BnplPlanReadModel>>(
                `${this.baseUrl}/${this.endpoint}/calculateInstallment`,
                data
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
