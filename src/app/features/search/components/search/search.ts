import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {SearchSuggest} from '../../../../shared/ui/search-suggest/search-suggest';
import {FormControl} from '@angular/forms';
import {Brewery} from '../../../models/breweries.interface';
import {HttpFetch} from '../../../../core/http/http-fetch';
import {filter, switchMap, take} from 'rxjs';
import {BreweriesParms} from '../../../models/breweries.params.type';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [
    SearchSuggest,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
   httpFetch = inject(HttpFetch);
   destroyRef = inject(DestroyRef);
   breweriesRequest = this.httpFetch.createRequest<Brewery[], BreweriesParms>()
   page = 1;
   perPage = 5;
   protected selectedItem: FormControl = new FormControl();
   query = signal('')
   queryObservable = toObservable(this.query)
   ngOnInit() {
     this.queryObservable.pipe(takeUntilDestroyed(this.destroyRef), filter(q => q !== ''), switchMap((query) =>
      this.getAllBreweries(query)
    )).subscribe()
  }
   getQuery(query:string) {
     this.query.set(query)
   }

  getAllBreweries(query: string) {
     return this.breweriesRequest.get('breweries/search', {
       page: this.page, per_page: this.perPage, query
     }).pipe(take(1))
  }

  protected seeAll() {
    this.perPage = 10;
    this.getAllBreweries(this.query()).subscribe()
  }
}
