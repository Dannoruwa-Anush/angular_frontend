import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { CashflowReadModel } from "../../models/api_models/read_models/cashflow_read_model";

@Injectable({
    providedIn: 'root',
})
export class CashflowService extends CrudService<CashflowReadModel, CashflowReadModel, CashflowReadModel> {

    protected endpoint = 'cashflow';

    constructor(
        http: HttpClient,
        messageService: SystemMessageService
    ) {
        super(http, messageService);
    }

    // Override : pagination
    getCashflowPaged(
        pageNumber: number,
        pageSize: number,
        cashflowStatusId?: number,
        searchKey?: string
    ) {
        return this.getPaged(pageNumber, pageSize, {
            cashflowStatusId,
            searchKey
        });
    }

    // can add custom api methods here
}
