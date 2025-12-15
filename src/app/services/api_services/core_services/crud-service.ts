import { Injectable } from '@angular/core';
import { environment } from '../../../config/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../models/api_models/core_api_models/apiResponse';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudService<T> {

  protected baseUrl = `${environment.BASE_API_URL.replace(/\/$/, '')}/api`;
  protected abstract endpoint: string;

  constructor(
    protected http: HttpClient,
  ) { }

  getAll(): Observable<T[]> {
    return this.http
      .get<ApiResponse<T[]>>(`${this.baseUrl}/${this.endpoint}`)
      .pipe(map(res => res.data));
  }

  getById(id: number | string): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(map(res => res.data));
  }

  create(data: T): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}/${this.endpoint}`, data)
      .pipe(map(res => res.data));
  }

  update(id: number | string, data: T): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}/${this.endpoint}/${id}`, data)
      .pipe(map(res => res.data));
  }

  delete(id: number | string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
