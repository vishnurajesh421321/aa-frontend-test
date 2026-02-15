import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HistoryItem } from './components/history-item/history-item';
import { SearchHistoryService } from '../../shared/services/search-history-service';
import { Brewery } from '../brewery-search/models/breweries.interface';
import { DatePipe } from '@angular/common';
import { BrewerySearchStore } from '../brewery-search/store/brewery.store';

@Component({
  selector: 'app-search-history',
  imports: [HistoryItem, DatePipe],
  templateUrl: './search-history.html',
  styleUrl: './search-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHistory implements OnInit {
  searchHistoryService = inject(SearchHistoryService);
  breweryStore = inject(BrewerySearchStore);
  searchHistory = this.searchHistoryService._history;
  ngOnInit() {
    this.searchHistoryService.loadHistory();
  }

  protected removeHistory(brewery: Brewery) {
    this.searchHistoryService.removeHistory(brewery);
  }

  protected handleHistorySelect(item: Brewery) {
    this.breweryStore.setSelectedHistory({ ...item });
  }
}
