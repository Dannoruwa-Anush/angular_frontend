import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { CategoryReadModel } from "../../models/api_models/read_models/category_read_Model";
import { CategoryCreateUpdateModel } from "../../models/api_models/create_update_models/category_create_update_Model";

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends CrudService<CategoryReadModel, CategoryCreateUpdateModel, CategoryCreateUpdateModel> {

  protected endpoint = 'category';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // Override : pagination
  getCategoryPaged(
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
