import { TestBed } from '@angular/core/testing';

import { HttpFetch } from './http-fetch';

describe('HttpFetch', () => {
  let service: HttpFetch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpFetch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
