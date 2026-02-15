import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';

import { HttpErrorInterceptor } from './http-error-interceptor';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let next: HttpHandler;

  beforeEach(() => {
    interceptor = new HttpErrorInterceptor();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps network errors to a friendly network message', async () => {
    const request = new HttpRequest('GET', '/api/breweries');
    const sourceError = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    next = {
      handle: () => throwError(() => sourceError),
    };

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toThrow(
      'Network error',
    );
    expect(console.error).toHaveBeenCalledWith('API Error:', sourceError);
  });

  it('maps server errors with payload message to that message', async () => {
    const request = new HttpRequest('GET', '/api/breweries');
    const sourceError = new HttpErrorResponse({
      status: 500,
      error: { message: 'Service unavailable' },
    });
    next = {
      handle: () => throwError(() => sourceError),
    };

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toThrow(
      'Service unavailable',
    );
  });

  it('falls back to generic message when server message is missing', async () => {
    const request = new HttpRequest('GET', '/api/breweries');
    const sourceError = new HttpErrorResponse({ status: 500, error: {} });
    next = {
      handle: () => throwError(() => sourceError),
    };

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toThrow(
      'Something went wrong',
    );
  });
});
