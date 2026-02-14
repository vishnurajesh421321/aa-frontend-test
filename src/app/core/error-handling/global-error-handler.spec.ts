import { HttpErrorResponse } from '@angular/common/http';

import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;

  beforeEach(() => {
    service = new GlobalErrorHandler();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles HTTP errors with the HTTP-specific message and global message', () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: '/api/search',
    });

    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('HTTP Error:', 404, error.message);
    expect(console.error).toHaveBeenCalledWith('Global Error:', error);
  });

  it('handles client errors with the client-specific message and global message', () => {
    const error = new Error('Unexpected crash');

    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('Client Error:', error);
    expect(console.error).toHaveBeenCalledWith('Global Error:', error);
  });
});
