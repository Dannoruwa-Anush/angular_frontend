import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { PhysicalShopSessionReadModel } from "../../models/api_models/read_models/physicalShopSession_read_model";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";

@Injectable({
  providedIn: 'root',
})
export class PhysicalShopSessionService extends CrudService<PhysicalShopSessionReadModel, PhysicalShopSessionReadModel, PhysicalShopSessionReadModel> {

  protected endpoint = 'physicalShopSession';

  constructor(
    http: HttpClient,
    messageService: SystemMessageService
  ) {
    super(http, messageService);
  }

  // Override CREATE (no body)
  override create(): Observable<PhysicalShopSessionReadModel> {
    this._loading.set(true);
    this.messageService.clear();

    return this.http
      .post<ApiResponseModel<PhysicalShopSessionReadModel>>(
        `${this.baseUrl}/${this.endpoint}`,
        null
      )
      .pipe(
        map(res => {
          this._loading.set(false);
          this.messageService.success(res.message || 'Session opened');
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // Override UPDATE (id only)
  override update(id: number): Observable<PhysicalShopSessionReadModel> {
    this._loading.set(true);
    this.messageService.clear();

    return this.http
      .put<ApiResponseModel<PhysicalShopSessionReadModel>>(
        `${this.baseUrl}/${this.endpoint}/${id}`,
        null
      )
      .pipe(
        map(res => {
          this._loading.set(false);
          this.messageService.success(res.message || 'Session closed');
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }
  
  // can add custom api methods here
}
