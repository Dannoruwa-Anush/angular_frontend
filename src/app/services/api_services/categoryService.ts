import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { CategoryModel } from "../../models/api_models/categoryModel";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends CrudService<CategoryModel, CategoryModel, CategoryModel> {

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
