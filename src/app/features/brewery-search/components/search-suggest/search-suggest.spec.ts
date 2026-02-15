import { ComponentFixture, flush, TestBed } from '@angular/core/testing';
import { should, vi } from 'vitest';

import { SearchSuggest } from './search-suggest';
import { Brewery } from '../../models/breweries.interface';
import { By } from '@angular/platform-browser';
import { ItemDetailsPanel } from '../item-details-panel/item-details-panel';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('SearchSuggest', () => {
  let component: SearchSuggest;
  let fixture: ComponentFixture<SearchSuggest>;
  let overlayContainer: OverlayContainer;
  let overlayElement: HTMLElement;
  const brewery = { id: '1', name: 'Brew One' } as Brewery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSuggest],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSuggest);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('minQueryLength', 3);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayElement = overlayContainer.getContainerElement();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies min length validator from input', () => {
    (component as any).query.setValue('ab');

    expect((component as any).query.valid).toBe(false);

    (component as any).query.setValue('abcd');

    expect((component as any).query.valid).toBe(true);
  });

  it('handles selected search history through effect', () => {
    fixture.componentRef.setInput('selectedSearchHistory', brewery);
    fixture.detectChanges();

    expect((component as any).query.value).toBe('Brew One');
    expect(component.selectedBrewery).toEqual(brewery);
    expect(component.isOpenOverlay()).toBe(true);
    expect(component.isOpenDetailsPanel()).toBe(true);
  });

  it('emits query and toggles overlay on value changes', () => {
    const queryEmitSpy = vi.spyOn(component.searchQuery, 'emit');
    component.ngOnInit();

    (component as any).query.setValue('ab');
    expect(component.isOpenOverlay()).toBe(false);
    expect(component.isOpenDetailsPanel()).toBe(false);
    expect(component.isActive).toBe(false);

    (component as any).query.setValue('abcd');
    expect(component.isOpenOverlay()).toBe(true);
    expect(component.isActive).toBe(true);
    expect(queryEmitSpy).toHaveBeenCalledWith('abcd');
  });

  it('selects brewery and opens details panel', () => {
    const selectEmitSpy = vi.spyOn(component.brewerySelectChange, 'emit');

    (component as any).selectBrewery(brewery);

    expect(component.selectedBrewery).toEqual(brewery);
    expect(component.isOpenDetailsPanel()).toBe(true);
    expect((component as any).query.value).toBe('Brew One');
    expect(selectEmitSpy).toHaveBeenCalledWith(brewery);
  });

  it('resets value and closes overlay/panel', () => {
    const selectEmitSpy = vi.spyOn(component.brewerySelectChange, 'emit');
    component.isOpenOverlay.set(true);
    component.isOpenDetailsPanel.set(true);

    (component as any).resetValue();

    expect(selectEmitSpy).toHaveBeenCalledWith(null);
    expect(component.isOpenOverlay()).toBe(false);
    expect(component.isOpenDetailsPanel()).toBe(false);
    expect(component.isActive).toBe(false);
  });

  it('closes details panel and keeps overlay open', () => {
    const selectEmitSpy = vi.spyOn(component.brewerySelectChange, 'emit');
    const closeEmitSpy = vi.spyOn(component.detailsPanelClosed, 'emit');

    (component as any).handleCloseDetailsPanel();

    expect(selectEmitSpy).toHaveBeenCalledWith(null);
    expect(component.isOpenOverlay()).toBe(false);
    expect(component.isOpenDetailsPanel()).toBe(false);
    expect(closeEmitSpy).toHaveBeenCalled();
    expect(component.isActive).toBe(false);
  });

  it('opens dropdown only when query is valid and has value and overlay is closed', () => {
    (component as any).query.setValue('brewery');
    component.isOpenOverlay.set(false);

    (component as any).openDropdown(true);

    expect(component.isOpenOverlay()).toBe(true);
    expect(component.isActive).toBe(true);
  });

  it('does not open dropdown when query is invalid, empty or already open', () => {
    (component as any).query.setValue('br');
    component.isOpenOverlay.set(false);

    (component as any).openDropdown(true);
    expect(component.isOpenOverlay()).toBe(false);

    (component as any).query.setValue('bre');
    component.isOpenOverlay.set(true);

    (component as any).openDropdown(true);
    expect(component.isOpenOverlay()).toBe(true);
  });
  it('should show minlength error and keep overlay closed when min query length is not met', () => {
    fixture.componentRef.setInput('minQueryLength', 3);
    fixture.detectChanges();

    (component as any).query.setValue('ab');
    (component as any).query.markAsTouched();
    (component as any).query.updateValueAndValidity();
    fixture.detectChanges();
    const errorText = fixture.nativeElement.querySelector('.form-error span');

    expect((component as any).query.hasError('minlength')).toBeTruthy();
    expect(component.isOpenOverlay()).toBeFalsy();
    expect(component.isActive).toBe(false);
    expect(errorText).not.toBeNull();
    expect(errorText!.textContent?.trim()).toBe('Type more characters…');
  });
  it('should render an empty state in overlay when an error exists', () => {
    component.isOpenOverlay.set(true);
    fixture.componentRef.setInput('error', 'Something went wrong');
    fixture.detectChanges();

    const emptyState = overlayElement.querySelector('.empty-item span')?.textContent?.trim();

    expect(emptyState).toBe('Something went wrong');
  });
  it('should render no items message when list is empty', () => {
    component.isOpenOverlay.set(true);
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    const emptyState = overlayElement.querySelector('.empty-item span')?.textContent?.trim();

    expect(emptyState).toBe('No items found');
  });
});
