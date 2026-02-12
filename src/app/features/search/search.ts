import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {SearchSuggest} from './components/search-suggest/search-suggest';
import {FormControl} from '@angular/forms';
import {filter} from 'rxjs';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {BrewerySearchStore} from './store/brewery.store';
import {SearchHistory} from '../search-history/search-history';
import {SearchHistoryService} from '../../shared/services/search-history-service';
import {Brewery} from './models/breweries.interface';

@Component({
  selector: 'app-search',
  imports: [
    SearchSuggest,
    SearchHistory,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  providers: [BrewerySearchStore],
})
export class Search implements OnInit {
   destroyRef = inject(DestroyRef);
   breweryStore =inject(BrewerySearchStore)
  searchHistoryService = inject(SearchHistoryService);
   protected selectedItem: FormControl = new FormControl();
   query = signal('')
   queryObservable = toObservable(this.query)
   ngOnInit() {
     this.queryObservable.pipe(takeUntilDestroyed(this.destroyRef), filter(q => q.length > 2)).subscribe(value => {
       this.breweryStore.seQuery(value);
     })
  }
   getQuery(query:string) {
     this.query.set(query)
   }

  protected seeAll() {
    this.breweryStore.sePageSize(10);
  }

  protected saveSelectedToHistory(brewery: Brewery) {
    this.searchHistoryService.saveSearchHistory(brewery)
  }
}
