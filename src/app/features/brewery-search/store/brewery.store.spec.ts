import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { BrewerySearchStore } from './brewery.store';
import { ApiService } from '../services/api-service';
import { SearchHistoryService } from '../../../shared/services/search-history-service';
import { Brewery } from '../models/breweries.interface';

describe('BrewerySearchStore', () => {
  let store: InstanceType<typeof BrewerySearchStore>;

  const breweries = [{ id: '1', name: 'Alpha' }] as Brewery[];
  const mockApiService = {
    searchBrewery: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockApiService.searchBrewery.mockReset();
    mockApiService.searchBrewery.mockReturnValue(of(breweries));

    TestBed.configureTestingModule({
      providers: [
        BrewerySearchStore,
        { provide: ApiService, useValue: mockApiService },
        { provide: SearchHistoryService, useValue: {} },
      ],
    });

    store = TestBed.inject(BrewerySearchStore);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('updates local state through setter methods', () => {
    store.setPageSize(10);
    store.setQuery('lager');
    store.setBreweries(breweries);
    store.setSelectedHistory(breweries[0]);

    expect(store.params().per_page).toBe(10);
    expect(store.params().query).toBe('lager');
    expect(store.breweries()).toEqual(breweries);
    expect(store.selectedHistory()).toEqual(breweries[0]);
  });

  it('searches breweries when query is non-empty and stores results', async () => {
    store.setQuery('ale');

    await vi.advanceTimersByTimeAsync(350);

    expect(mockApiService.searchBrewery).toHaveBeenCalledWith({
      page: 1,
      per_page: 5,
      query: 'ale',
    });
    expect(store.breweries()).toEqual(breweries);
    expect(store.loading()).toBe(false);
  });

  it('does not search when query is empty', async () => {
    await vi.advanceTimersByTimeAsync(350);

    expect(mockApiService.searchBrewery).not.toHaveBeenCalled();
  });

  it('handles search errors and resets loading state', async () => {
    const error = new Error('api failed');
    mockApiService.searchBrewery.mockReturnValue(throwError(() => error));

    store.setQuery('stout');

    await vi.advanceTimersByTimeAsync(350);

    expect(mockApiService.searchBrewery).toHaveBeenCalled();
    expect(store.loading()).toBe(false);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
