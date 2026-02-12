import {inject, Injectable, signal} from '@angular/core';
import {Brewery, BrewerySearchHistory} from '../../features/search/models/breweries.interface';
import {SessionService} from './session-service';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  private readonly storageKey = 'BREWERY_SEARCH_HISTORY';
  private sessionService = inject(SessionService);
  private searchHistories: Map<string, BrewerySearchHistory> = new Map();
  private readonly history = signal<BrewerySearchHistory[]>([]);
  saveSearchHistory(searchHistory: Brewery) {
    if(!this.searchHistories.has(searchHistory.id)) {
      const createdAt = new Date().toDateString();
      this.searchHistories.set(searchHistory.id, {...searchHistory, createdAt});
    }
    this.history.set([...this.searchHistories.values()])
    this.sessionService.storeItem<Brewery[]>(this.storageKey, [...this.searchHistories.values()]);
  }
   loadHistory() {
    const breweries = this.sessionService.getItem<BrewerySearchHistory[]>(this.storageKey);
    if(breweries) {
      breweries.forEach((item: BrewerySearchHistory) => {
        this.searchHistories.set(item.id, item);
      })
    }
    this.history.set([...this.searchHistories.values()])
  }

  removeHistory(searchHistory: Brewery) {
    if(this.searchHistories.has(searchHistory.id)) {
      this.searchHistories.delete(searchHistory.id);
      this.history.set([...this.searchHistories.values()])
      this.sessionService.storeItem<Brewery[]>(this.storageKey, [...this.searchHistories.values()]);
    }
  }
  get _history() {
    return this.history;
  }
}
