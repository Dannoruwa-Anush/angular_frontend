import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { CategoryModel } from "../../models/api_models/categoryModel";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends CrudService<CategoryModel> {

  protected endpoint = 'category';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // can add custom api methods here
}
