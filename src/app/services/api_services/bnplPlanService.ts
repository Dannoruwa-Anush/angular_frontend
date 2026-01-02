import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BnplPlanReadModel } from "../../models/api_models/read_models/bnpl_plan_read_model";
import { CrudService } from "./core_services/crud-service";
import { SystemMessageService } from "../ui_service/systemMessageService";

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
}
