import { Injectable } from '@angular/core';
import { environment } from '../../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.get<T[]>(`${this.baseUrl}/${this.endpoint}`);
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  create(data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${this.endpoint}`, data);
  }

  update(id: number | string, data: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${this.endpoint}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${this.endpoint}/${id}`);
  }
}
