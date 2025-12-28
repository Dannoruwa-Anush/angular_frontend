import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { BrandReadModel } from "../../models/api_models/read_models/brand_read_Model";
import { BrandCreateUpdateModel } from "../../models/api_models/create_update_models/brand_create_update_Model";

@Injectable({
  providedIn: 'root',
})
export class BrandService extends CrudService<BrandReadModel, BrandCreateUpdateModel, BrandCreateUpdateModel> {

  protected endpoint = 'brand';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // Override : pagination
  getBrandPaged(
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
