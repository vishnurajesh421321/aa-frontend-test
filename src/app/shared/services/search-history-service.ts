import { inject, Injectable, signal } from '@angular/core';
import { Brewery } from '../../features/brewery-search/models/breweries.interface';
import { SessionService } from './session-service';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  private readonly storageKey = 'BREWERY_SEARCH_HISTORY';
  private sessionService = inject(SessionService);
  private searchHistories = new Map<string, Brewery>();
  private readonly history = signal<Brewery[]>([]);
  historyMaxCount = 5;
  saveSearchHistory(searchHistory: Brewery) {
    const createdAt = new Date().toISOString();
    this.searchHistories.set(searchHistory.id, { ...searchHistory, createdAt });
    if (this.searchHistories.size > this.historyMaxCount) {
      this.searchHistories.delete(this.history()[this.historyMaxCount - 1].id);
    }
    const searchHistories = [...this.searchHistories.values()];
    this.sortHistoryByDate(searchHistories);
    this.history.set(searchHistories);
    this.sessionService.storeItem<Brewery[]>(this.storageKey, searchHistories);
  }
  loadHistory() {
    const breweries = this.sessionService.getItem<Brewery[]>(this.storageKey);
    this.searchHistories.clear();
    if (breweries) {
      this.sortHistoryByDate(breweries);
      breweries.forEach((item: Brewery) => {
        this.searchHistories.set(item.id, item);
      });
    }
    this.history.set([...this.searchHistories.values()]);
  }

  sortHistoryByDate(history: Brewery[]) {
    history.sort((a, b) => Date.parse(b?.createdAt ?? '') - Date.parse(a.createdAt ?? ''));
  }

  removeHistory(searchHistory: Brewery) {
    if (this.searchHistories.has(searchHistory.id)) {
      this.searchHistories.delete(searchHistory.id);
      this.history.set([...this.searchHistories.values()]);
      this.sessionService.storeItem<Brewery[]>(this.storageKey, [...this.searchHistories.values()]);
    }
  }
  clearSearchHistory() {
    this.searchHistories.clear();
    this.history.set([]);
    this.sessionService.removeSession(this.storageKey);
  }
  get _history() {
    return this.history;
  }
}
