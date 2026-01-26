import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { PaymentCreateModel } from "../../models/api_models/create_update_models/create_models/payment_create_Model";

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends CrudService<PaymentCreateModel, PaymentCreateModel, PaymentCreateModel> {

  protected endpoint = 'payment';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // can add custom api methods here
}
