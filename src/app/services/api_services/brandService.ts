import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { BrandModel } from "../../models/api_models/brandModel";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";

@Injectable({
  providedIn: 'root',
})
export class BrandService extends CrudService<BrandModel> {

  protected endpoint = 'brand';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // can add custom api methods here
}
