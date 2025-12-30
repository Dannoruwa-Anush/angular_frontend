import { Injectable } from "@angular/core";
import { CrudService } from "./core_services/crud-service";
import { BnplPlanTypeReadModel } from "../../models/api_models/read_models/bnplPlanType_read_Model";
import { BnplPlanTypeCreateUpdateModel } from "../../models/api_models/create_update_models/bnplPlanType_create_update_Model";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

@Injectable({
  providedIn: 'root',
})
export class BnplPlanTypeService extends CrudService<BnplPlanTypeReadModel, BnplPlanTypeCreateUpdateModel, BnplPlanTypeCreateUpdateModel> {

  protected endpoint = 'BNPL_PlanType';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // Override : pagination
  getBnplPlanTypePaged(
    pageNumber: number,
    pageSize: number,
    searchKey?: string
  ) {
    return this.getPaged(pageNumber, pageSize, {
      searchKey
    });
  }
  // can add custom api methods here
}
