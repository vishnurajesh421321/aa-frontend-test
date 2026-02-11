import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, finalize, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpFetch {
  private env = environment.apiBaseUrl;
  private http = inject(HttpClient);
  createRequest<TData, TParams>() {
    const isLoading = signal(false);
    const error = signal<HttpErrorResponse | null>(null);
    const data = signal<TData | null>(null)
    const get = (endPoint: string, params: Record<keyof TParams, string | number | boolean>) => {
      isLoading.set(true);
      return this.http.get<TData>(`${this.env}${endPoint}`, {params: params}).pipe(
        tap(res => data.set(res)),
        catchError((err: HttpErrorResponse) => {
          error.set(err);
          return throwError(() => err);
        }),
        finalize(() => isLoading.set(false))
      )
    }
    return {data, isLoading, error, get};
  }
}
