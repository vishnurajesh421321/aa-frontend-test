import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {HistoryItem} from './components/history-item/history-item';
import {SearchHistoryService} from '../../shared/services/search-history-service';
import {Brewery} from '../search/models/breweries.interface';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-search-history',
  imports: [
    HistoryItem,
    DatePipe
  ],
  templateUrl: './search-history.html',
  styleUrl: './search-history.scss',
})
export class SearchHistory implements OnInit, OnDestroy {
  searchHistoryService = inject(SearchHistoryService);
  searchHistory = this.searchHistoryService._history;
  ngOnInit() {
     this.searchHistoryService.loadHistory()
  }

  protected removeHistory(brewery: Brewery) {
    this.searchHistoryService.removeHistory(brewery)
  }

  ngOnDestroy() {
    this.searchHistoryService.clearSearchHistory()
  }
}
