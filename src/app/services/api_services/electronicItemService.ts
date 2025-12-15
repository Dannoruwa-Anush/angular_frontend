import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { ElectronicItemModel } from "../../models/api_models/electronicItemModel";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ElectronicItemService extends CrudService<ElectronicItemModel> {

  protected endpoint = 'electronicItem';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override : pagination
  getElectronicItemPaged(
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
