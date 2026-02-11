import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        const message =
          error.status === 0
            ? 'Network error'
            : error.error?.message || 'Something went wrong';
        return throwError(() => new Error(message));
      })
    );
  }
}
