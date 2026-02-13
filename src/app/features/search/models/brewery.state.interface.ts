import {Brewery} from './breweries.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {BreweriesParms} from './breweries.params.type';

export interface BreweryState  {
  breweries: Brewery[],
  loading: boolean,
  error: HttpErrorResponse | null,
  params: BreweriesParms;
  selectedHistory: Brewery | null;
}
