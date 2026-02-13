import {patchState, signalStore, withMethods, withProps, withState} from '@ngrx/signals';
import { effect, inject} from '@angular/core';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, pipe, switchMap, tap} from 'rxjs';
import {ApiService} from '../services/api-service';
import { tapResponse } from '@ngrx/operators';
import {BreweryState} from '../models/brewery.state.interface';
import {BreweriesParms} from '../models/breweries.params.type';
import {Brewery} from '../models/breweries.interface';
import {SearchHistoryService} from '../../../shared/services/search-history-service';

export const BreweryInitialState: BreweryState = {
  breweries: [],
  loading: false,
  error: null,
  selectedHistory: null,
  params: {
    page: 1,
    per_page: 5,
    query: '',
  },
}
export const BrewerySearchStore = signalStore(
  withState<BreweryState>(BreweryInitialState),
  withProps(() => ({
    apiService: inject(ApiService),
    historyService: inject(SearchHistoryService),
  })),
  withMethods((store) => {
    const searchBrewery = rxMethod<BreweriesParms>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { breweries: [] })),
        filter((params) => params.query !== ''),
        tap(() => patchState(store, { loading: true })),
        switchMap((params) => {
          return store.apiService.searchBrewery(params).pipe(
            tapResponse({
              next: (breweries) =>
                patchState(store, { breweries, loading: false }),
              error: (err) => {
                patchState(store, { loading: false });
                console.error(err);
              },
            })
          );
        })
      )
    )
    effect(() => {
      searchBrewery(store.params());
    });
    return {
      setQuery(query: string) {
        patchState(store, {params: {...store.params(), query}});
      },
      setPageSize(perPage: number) {
        patchState(store, {params: {...store.params(), per_page: perPage}});
      },
      setBreweries(breweries: Brewery[]) {
        patchState(store, {breweries});
      },
      setSelectedHistory(selectedHistory: Brewery | null) {
        patchState(store, {selectedHistory});
      }
    }
  })
);
