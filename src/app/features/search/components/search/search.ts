import {Component, computed, inject} from '@angular/core';
import {SearchSuggest} from '../../../../shared/ui/search-suggest/search-suggest';
import {FormControl} from '@angular/forms';
import {Brewery} from '../../../models/breweries.interface';
import {HttpFetch} from '../../../../core/http/http-fetch';
import {take} from 'rxjs';
import {BreweriesParms} from '../../../models/breweries.params.type';

@Component({
  selector: 'app-search',
  imports: [
    SearchSuggest
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
   apiService = inject(HttpFetch);
   breweriesRequest = this.apiService.createRequest<Brewery[], BreweriesParms>()
   page = 1;
   perPage = 10;
   isLoading = false;
  protected selectedItem: FormControl = new FormControl();
   getAllBreweries(query:string) {
     this.breweriesRequest.get('breweries/search', {
       page: this.page, per_page: this.perPage, query
     }).pipe(take(1)).subscribe()
   }
}
