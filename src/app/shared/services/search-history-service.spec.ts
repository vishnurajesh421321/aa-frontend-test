import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SearchHistoryService } from './search-history-service';
import { SessionService } from './session-service';
import { Brewery } from '../../features/brewery-search/models/breweries.interface';

describe('SearchHistoryService', () => {
  let service: SearchHistoryService;

  const mockSessionService = {
    storeItem: vi.fn(),
    getItem: vi.fn(),
    removeSession: vi.fn(),
  };

  const createBrewery = (id: string, createdAt?: string): Brewery => ({
    id,
    name: `brew-${id}`,
    brewery_type: 'micro',
    city: 'City',
    state_province: 'State Province',
    country: 'Country',
    phone: '1234567890',
    website_url: 'https://example.com',
    state: 'State',
    street: 'Street',
    createdAt,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    });
    service = TestBed.inject(SearchHistoryService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    service.clearSearchHistory();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('saves brewery-search history and persists sorted list', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

    service.saveSearchHistory(createBrewery('1'));

    vi.setSystemTime(new Date('2024-01-02T00:00:00.000Z'));
    service.saveSearchHistory(createBrewery('2'));

    const history = service._history();

    expect(history.length).toBe(2);
    expect(history[0].id).toBe('2');
    expect(history[1].id).toBe('1');
    expect(mockSessionService.storeItem).toHaveBeenCalledWith('BREWERY_SEARCH_HISTORY', history);
  });

  it('removes oldest item when max count is reached', () => {
    service.historyMaxCount = 2;

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    service.saveSearchHistory(createBrewery('1'));

    vi.setSystemTime(new Date('2024-01-02T00:00:00.000Z'));
    service.saveSearchHistory(createBrewery('2'));

    vi.setSystemTime(new Date('2024-01-03T00:00:00.000Z'));
    service.saveSearchHistory(createBrewery('3'));

    expect(service._history().map((item) => item.id)).toEqual(['3', '2']);
  });

  it('loads history from session and sorts by createdAt', () => {
    const older = createBrewery('1', '2024-01-01T00:00:00.000Z');
    const newer = createBrewery('2', '2024-01-02T00:00:00.000Z');
    mockSessionService.getItem.mockReturnValue([older, newer]);

    service.loadHistory();

    expect(mockSessionService.getItem).toHaveBeenCalledWith('BREWERY_SEARCH_HISTORY');
    expect(service._history().map((item) => item.id)).toEqual(['2', '1']);
  });

  it('clears map before loading when no stored history exists', () => {
    service.saveSearchHistory(createBrewery('1'));
    mockSessionService.getItem.mockReturnValue(null);

    service.loadHistory();

    expect(service._history()).toEqual([]);
  });

  it('sortHistoryByDate handles missing createdAt safely', () => {
    const withDate = createBrewery('1', '2024-01-01T00:00:00.000Z');
    const withoutDate = createBrewery('2');
    const list = [withoutDate, withDate];

    service.sortHistoryByDate(list);

    expect(list.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('removes an existing history item and persists updated values', () => {
    service.saveSearchHistory(createBrewery('1'));
    service.saveSearchHistory(createBrewery('2'));

    service.removeHistory(createBrewery('1'));

    expect(service._history().map((item) => item.id)).toEqual(['2']);
    expect(mockSessionService.storeItem).toHaveBeenCalledWith('BREWERY_SEARCH_HISTORY', [
      service._history()[0],
    ]);
  });

  it('does not persist when removing a non-existent history item', () => {
    service.removeHistory(createBrewery('404'));

    expect(mockSessionService.storeItem).not.toHaveBeenCalled();
  });

  it('clears brewery-search history and session storage', () => {
    service.saveSearchHistory(createBrewery('1'));

    service.clearSearchHistory();

    expect(service._history()).toEqual([]);
    expect(mockSessionService.removeSession).toHaveBeenCalledWith('BREWERY_SEARCH_HISTORY');
  });
});
