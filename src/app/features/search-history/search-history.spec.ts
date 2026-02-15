import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SearchHistory } from './search-history';
import { SearchHistoryService } from '../../shared/services/search-history-service';
import { BrewerySearchStore } from '../brewery-search/store/brewery.store';
import { Brewery } from '../brewery-search/models/breweries.interface';
import { signal } from '@angular/core';

describe('SearchHistory', () => {
  let component: SearchHistory;
  let fixture: ComponentFixture<SearchHistory>;

  const historySignal = signal<Brewery[]>([]);
  const mockSearchHistoryService = {
    _history: historySignal,
    loadHistory: vi.fn(),
    removeHistory: vi.fn(),
    clearSearchHistory: vi.fn(),
  };
  const mockBreweryStore = {
    setSelectedHistory: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHistory],
      providers: [
        { provide: SearchHistoryService, useValue: mockSearchHistoryService },
        { provide: BrewerySearchStore, useValue: mockBreweryStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.searchHistory).toBe(historySignal);
  });

  it('loads history on init', () => {
    component.ngOnInit();

    expect(mockSearchHistoryService.loadHistory).toHaveBeenCalled();
  });

  it('removes history item through service', () => {
    const brewery = { id: '1', name: 'Alpha' } as Brewery;

    (component as any).removeHistory(brewery);

    expect(mockSearchHistoryService.removeHistory).toHaveBeenCalledWith(brewery);
  });


  it('handles selected history item', () => {
    const brewery = { id: '9', name: 'Beta' } as Brewery;

    (component as any).handleHistorySelect(brewery);

    expect(mockBreweryStore.setSelectedHistory).toHaveBeenCalledWith(brewery);
  });
  it('should show the text "No history records found" when history is empty', () => {
    const text = fixture.nativeElement.querySelector('small') as HTMLElement;
    expect(text.textContent.trim()).toBe('No history records found');
  });
});
