import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { ElectronicItemModel } from "../../models/api_models/electronicItemModel";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

@Injectable({
  providedIn: 'root',
})
export class ElectronicItemService extends CrudService<ElectronicItemModel> {

  protected endpoint = 'electronicItem';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }
  
  // Override : pagination
  getElectronicItemPaged(
    pageNumber: number,
    pageSize: number,
    categoryId?: number,
    brandId?: number,
    searchKey?: string
  ) {
    return this.getPaged(pageNumber, pageSize, {
      categoryId,
      brandId,
      searchKey
    });
  }

  // can add custom api methods here

}
