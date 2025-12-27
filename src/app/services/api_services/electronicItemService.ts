import { Injectable } from "@angular/core";

import { CrudService } from "./core_services/crud-service";
import { ElectronicItemModel } from "../../models/api_models/electronicItemModel";
import { HttpClient } from "@angular/common/http";
import { SystemMessageService } from "../ui_service/systemMessageService";
import { catchError, map, Observable } from "rxjs";
import { ApiResponseModel } from "../../models/api_models/core_api_models/apiResponseModel";

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

  // Override : Create for multipart
  override create(
    data: ElectronicItemModel
  ): Observable<ElectronicItemModel> {

    const formData = this.toFormData(data);

    return this.http
      .post<ApiResponseModel<ElectronicItemModel>>(
        `${this.baseUrl}/${this.endpoint}`,
        formData
      )
      .pipe(
        map(res => {
          this.messageService.success(res.message || 'Created successfully');
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // Override : Update for multipart
  override update(
    id: number | string,
    data: ElectronicItemModel
  ): Observable<ElectronicItemModel> {

    const formData = this.toFormData(data);

    return this.http
      .put<ApiResponseModel<ElectronicItemModel>>(
        `${this.baseUrl}/${this.endpoint}/${id}`,
        formData
      )
      .pipe(
        map(res => {
          this.messageService.success(res.message || 'Updated successfully');
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // Helper : to convert to formdata
  private toFormData(data: Partial<ElectronicItemModel>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    });

    return formData;
  }

  // can add custom api methods here
  
}
