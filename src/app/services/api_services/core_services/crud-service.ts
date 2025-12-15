import { Injectable } from '@angular/core';

import { environment } from '../../../config/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PaginationResponseModel } from '../../../models/api_models/core_api_models/paginationResponseModel';
import { ApiResponseModel } from '../../../models/api_models/core_api_models/apiResponseModel';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudService<T> {

  protected baseUrl = `${environment.BASE_API_URL.replace(/\/$/, '')}/api`;
  protected abstract endpoint: string;

  constructor(
    protected http: HttpClient,
  ) { }

  // Get All
  getAll(): Observable<T[]> {
    return this.http
      .get<ApiResponseModel<T[]>>(`${this.baseUrl}/${this.endpoint}`)
      .pipe(map(res => res.data));
  }

  // Get By Id
  getById(id: number | string): Observable<T> {
    return this.http
      .get<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(map(res => res.data));
  }

  // Create
  create(data: T): Observable<T> {
    return this.http
      .post<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}`, data)
      .pipe(map(res => res.data));
  }

  // Update
  update(id: number | string, data: T): Observable<T> {
    return this.http
      .put<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}/${id}`, data)
      .pipe(map(res => res.data));
  }

  // Delete
  delete(id: number | string): Observable<void> {
    return this.http
      .delete<ApiResponseModel<void>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  // Generic pagination : Get
  getPaged(
    pageNumber: number,
    pageSize: number,
    extraParams?: Record<string, any>
  ): Observable<PaginationResponseModel<T>> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (extraParams) {
      Object.keys(extraParams).forEach(key => {
        const value = extraParams[key];
        if (value !== null && value !== undefined) {
          params = params.set(key, value);
        }
      });
    }

    return this.http
      .get<ApiResponseModel<PaginationResponseModel<T>>>(
        `${this.baseUrl}/${this.endpoint}/paged`,
        { params }
      )
      .pipe(map(res => res.data));
  }
}
