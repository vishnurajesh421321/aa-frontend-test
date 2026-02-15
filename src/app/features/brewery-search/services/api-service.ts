import { inject, Injectable } from '@angular/core';
import { BreweriesParams } from '../models/breweries.params.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Brewery } from '../models/breweries.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  env = environment.apiBaseUrl;
  http = inject(HttpClient);
  searchBrewery(params: BreweriesParams) {
    return this.http.get<Brewery[]>(`${this.env}breweries/search`, { params });
  }
}
