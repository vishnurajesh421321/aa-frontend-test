import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ApiService } from './api-service';

describe('ApiService', () => {
  let service: ApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calls breweries search endpoint with provided params', () => {
    const params = { page: 1, per_page: 5, query: 'brew' };
    const response = [{ id: '1', name: 'Brew One' }];

    service.searchBrewery(params).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpController.expectOne(
      (request) =>
        request.url.endsWith('/breweries/search') &&
        request.params.get('query') === 'brew' &&
        request.params.get('per_page') === '5',
    );

    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});
