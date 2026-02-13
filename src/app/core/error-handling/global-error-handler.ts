import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleClientError(error);
    }
    console.error('Global Error:', error);
  }
  private handleHttpError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error.status, error.message);
  }
  private handleClientError(error: unknown) {
    console.error('Client Error:', error);
  }
}
