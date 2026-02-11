import {inject, Injectable} from '@angular/core';
import {HttpFetch} from '../../core/http/http-fetch';
import {Brewery} from '../models/breweries.interface';
type BreweriesParms = {
  page: number;
  query: string;
  per_page: number;
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpFetch = inject(HttpFetch);
  getBreweries(apiUrl: string, params: BreweriesParms) {
    const breweries = this.httpFetch.createRequest<Brewery[], BreweriesParms>()
    return breweries.get(apiUrl, params);
  }
}
