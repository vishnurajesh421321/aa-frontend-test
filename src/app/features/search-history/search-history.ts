import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HistoryItem } from './components/history-item/history-item';
import { SearchHistoryService } from '../../shared/services/search-history-service';
import { Brewery } from '../search/models/breweries.interface';
import { DatePipe } from '@angular/common';
import { BrewerySearchStore } from '../search/store/brewery.store';

@Component({
  selector: 'app-search-history',
  imports: [HistoryItem, DatePipe],
  templateUrl: './search-history.html',
  styleUrl: './search-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHistory implements OnInit, OnDestroy {
  searchHistoryService = inject(SearchHistoryService);
  breweryStore = inject(BrewerySearchStore);
  searchHistory = this.searchHistoryService._history;
  ngOnInit() {
    this.searchHistoryService.loadHistory();
  }

  protected removeHistory(brewery: Brewery) {
    this.searchHistoryService.removeHistory(brewery);
  }

  ngOnDestroy() {
    this.searchHistoryService.clearSearchHistory();
  }

  protected handleHistorySelect(item: Brewery) {
    this.breweryStore.setSelectedHistory(item);
  }
}
