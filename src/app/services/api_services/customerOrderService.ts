import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { CustomerOrderReadModel } from "../../models/api_models/read_models/customerOrder_read_Model";
import { CustomerOrderCreateModel } from "../../models/api_models/create_update_models/create_models/customerOrder_create_Model";
import { CustomerOrderUpdateModel } from "../../models/api_models/create_update_models/update_models/customerOrder_update_Model";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

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
}
