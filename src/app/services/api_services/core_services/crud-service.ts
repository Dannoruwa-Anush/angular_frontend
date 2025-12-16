import { Injectable, Signal, signal } from '@angular/core';

import { environment } from '../../../config/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { PaginationResponseModel } from '../../../models/api_models/core_api_models/paginationResponseModel';
import { ApiResponseModel } from '../../../models/api_models/core_api_models/apiResponseModel';
import { SystemMessageService } from '../../ui_service/systemMessageService';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudService<T> {

  protected baseUrl = `${environment.BASE_API_URL.replace(/\/$/, '')}/api`;
  protected abstract endpoint: string;

  // ---------- STATE ----------
  protected _loading = signal(false);
  loading: Signal<boolean> = this._loading.asReadonly();

  constructor(
    protected http: HttpClient,
    protected messageService: SystemMessageService
  ) { }

  // ---------- HELPERS ----------
  protected handleHttpError(err: HttpErrorResponse): Observable<never> {
    this._loading.set(false);
    this.messageService.error(
      err.error?.message ?? 'Unexpected error occurred'
    );
    return EMPTY;
  }

  // ---------- CRUD ----------
  // GET_ALL
  getAll(): Observable<T[]> {
    this._loading.set(true);

    return this.http
      .get<ApiResponseModel<T[]>>(`${this.baseUrl}/${this.endpoint}`)
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // GET_BY_ID
  getById(id: number | string): Observable<T> {
    this._loading.set(true);

    return this.http
      .get<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // SAVE
  create(data: T): Observable<T> {
    this._loading.set(true);
    this.messageService.clear();

    return this.http
      .post<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}`, data)
      .pipe(
        map(res => {
          this._loading.set(false);
          this.messageService.success(res.message || 'Created successfully');
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // UPDATE
  update(id: number | string, data: T): Observable<T> {
    this._loading.set(true);
    this.messageService.clear();

    return this.http
      .put<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}/${id}`, data)
      .pipe(
        map(res => {
          this._loading.set(false);
          this.messageService.success(res.message || 'Updated successfully');
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // DELETE
  delete(id: number | string): Observable<void> {
    this._loading.set(true);
    this.messageService.clear();

    return this.http
      .delete<ApiResponseModel<void>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(
        map(res => {
          this._loading.set(false);
          this.messageService.success(res.message || 'Deleted successfully');
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // PAGINATION: GET_ALL
  getPaged(
    pageNumber: number,
    pageSize: number,
    extraParams?: Record<string, any>
  ): Observable<PaginationResponseModel<T>> {

    this._loading.set(true);

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
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }
}
