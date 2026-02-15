import { Brewery } from './breweries.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { BreweriesParams } from './breweries.params.type';

export interface BreweryState {
  breweries: Brewery[];
  loading: boolean;
  error: HttpErrorResponse | null;
  params: BreweriesParams;
  selectedHistory: Brewery | null;
}
