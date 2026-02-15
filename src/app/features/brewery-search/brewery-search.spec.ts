import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrewerySearch } from './brewery-search';
import { Brewery } from './models/breweries.interface';
import { vi } from 'vitest';

describe('BrewerySearch', () => {
  let component: BrewerySearch;
  let fixture: ComponentFixture<BrewerySearch>;

  const brewery: Brewery = {
    id: '1',
    name: 'Test Brewery',
    brewery_type: 'micro',
    city: 'Test City',
    state_province: 'Test Province',
    country: 'Test Country',
    phone: '123456',
    website_url: 'https://example.com',
    state: 'Test State',
    street: '123 Test St',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrewerySearch],
    }).compileComponents();

    fixture = TestBed.createComponent(BrewerySearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears breweries when query is shorter than the minimum length', () => {
    const setBreweriesSpy = vi.spyOn(component.breweryStore, 'setBreweries');
    const setQuerySpy = vi.spyOn(component.breweryStore, 'setQuery');

    component.getQuery('ab');

    expect(setBreweriesSpy).toHaveBeenCalledWith([]);
    expect(setQuerySpy).not.toHaveBeenCalled();
  });

  it('sets query when query meets minimum length', () => {
    const setBreweriesSpy = vi.spyOn(component.breweryStore, 'setBreweries');
    const setQuerySpy = vi.spyOn(component.breweryStore, 'setQuery');

    component.getQuery('brew');

    expect(setQuerySpy).toHaveBeenCalledWith('brew');
    expect(setBreweriesSpy).not.toHaveBeenCalled();
  });

  it('expands page size to max when seeAll is called below max', () => {
    component.pageSize = (() => 5) as BrewerySearch['pageSize'];
    const setPageSizeSpy = vi.spyOn(component.breweryStore, 'setPageSize');

    component['seeAll']();

    expect(setPageSizeSpy).toHaveBeenCalledWith(component.maxPageSize);
  });

  it('reduces page size to min when seeAll is called at max or above', () => {
    component.pageSize = (() => 10) as BrewerySearch['pageSize'];
    const setPageSizeSpy = vi.spyOn(component.breweryStore, 'setPageSize');

    component['seeAll']();

    expect(setPageSizeSpy).toHaveBeenCalledWith(component.minPageSize);
  });

  it('saves selected brewery to history and clears selected history when brewery exists', () => {
    const setSelectedHistorySpy = vi.spyOn(component.breweryStore, 'setSelectedHistory');
    const saveSearchHistorySpy = vi.spyOn(component.searchHistoryService, 'saveSearchHistory');

    component['saveSelectedToHistory'](brewery);

    expect(setSelectedHistorySpy).toHaveBeenCalledWith(null);
    expect(saveSearchHistorySpy).toHaveBeenCalledWith(brewery);
  });

  it('does nothing when saving null brewery to history', () => {
    const setSelectedHistorySpy = vi.spyOn(component.breweryStore, 'setSelectedHistory');
    const saveSearchHistorySpy = vi.spyOn(component.searchHistoryService, 'saveSearchHistory');

    component['saveSelectedToHistory'](null);

    expect(setSelectedHistorySpy).not.toHaveBeenCalled();
    expect(saveSearchHistorySpy).not.toHaveBeenCalled();
  });

  it('restores history brewery into list when details panel closes with selected history', () => {
    vi.spyOn(component.breweryStore, 'selectedHistory').mockReturnValue(brewery);
    const setBreweriesSpy = vi.spyOn(component.breweryStore, 'setBreweries');
    const setSelectedHistorySpy = vi.spyOn(component.breweryStore, 'setSelectedHistory');

    component['handleDetailsPanelChange']();

    expect(setBreweriesSpy).toHaveBeenCalledWith([brewery]);
    expect(setSelectedHistorySpy).toHaveBeenCalledWith(null);
  });

  it('does not restore history brewery when details panel stays open', () => {
    vi.spyOn(component.breweryStore, 'selectedHistory').mockReturnValue(brewery);
    const setBreweriesSpy = vi.spyOn(component.breweryStore, 'setBreweries');
    const setSelectedHistorySpy = vi.spyOn(component.breweryStore, 'setSelectedHistory');

    component['handleDetailsPanelChange']();

    expect(setBreweriesSpy).toHaveBeenCalled();
    expect(setSelectedHistorySpy).toHaveBeenCalled();
  });

  it('does not restore history brewery when no selected history exists', () => {
    vi.spyOn(component.breweryStore, 'selectedHistory').mockReturnValue(null);
    const setBreweriesSpy = vi.spyOn(component.breweryStore, 'setBreweries');
    const setSelectedHistorySpy = vi.spyOn(component.breweryStore, 'setSelectedHistory');

    component['handleDetailsPanelChange']();

    expect(setBreweriesSpy).not.toHaveBeenCalled();
    expect(setSelectedHistorySpy).not.toHaveBeenCalled();
  });
});
