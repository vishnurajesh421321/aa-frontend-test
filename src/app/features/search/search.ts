import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchSuggest } from './components/search-suggest/search-suggest';
import { BrewerySearchStore } from './store/brewery.store';
import { SearchHistory } from '../search-history/search-history';
import { SearchHistoryService } from '../../shared/services/search-history-service';
import { Brewery } from './models/breweries.interface';

@Component({
  selector: 'app-search',
  imports: [SearchSuggest, SearchHistory],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  providers: [BrewerySearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  breweryStore = inject(BrewerySearchStore);
  searchHistoryService = inject(SearchHistoryService);
  pageSize = this.breweryStore.params.per_page;
  maxPageSize = 10;
  minPageSize = 5;
  minQueryLength = 3;
  getQuery(query: string) {
    if (query.length < this.minQueryLength) {
      this.breweryStore.setBreweries([]);
    } else {
      this.breweryStore.setQuery(query);
    }
  }

  protected seeAll() {
    if (this.pageSize() < this.maxPageSize) {
      this.breweryStore.setPageSize(this.maxPageSize);
    } else {
      this.breweryStore.setPageSize(this.minPageSize);
    }
  }

  protected saveSelectedToHistory(brewery: Brewery | null) {
    if (brewery) {
      this.breweryStore.setSelectedHistory(null);
      this.searchHistoryService.saveSearchHistory(brewery);
    }
  }

  protected handleDetailsPanelChange() {
    const selectedHistory = this.breweryStore.selectedHistory();
    if (selectedHistory) {
      this.breweryStore.setBreweries([selectedHistory]);
      this.breweryStore.setSelectedHistory(null);
    }
  }
}
