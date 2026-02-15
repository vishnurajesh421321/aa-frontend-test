import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { HistoryItem } from './history-item';
import { Brewery } from '../../../brewery-search/models/breweries.interface';
import { By } from '@angular/platform-browser';

describe('HistoryItem', () => {
  let component: HistoryItem;
  let fixture: ComponentFixture<HistoryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryItem],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'TEST TITLE');
    fixture.componentRef.setInput('date', '2026-02-13');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stops event propagation and emits title when remove is clicked', () => {
    const event = { stopPropagation: vi.fn() } as unknown as MouseEvent;
    const emitSpy = vi.spyOn(component.remove, 'emit');

    (component as any).handleOnRemove(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('TEST TITLE');
  });
  it('selects history item when clicking a history row', () => {
    const emitSpy = vi.spyOn(component.selected, 'emit');

    fixture.detectChanges();

    const historyItem = fixture.debugElement.query(By.css('.history-item'));
    historyItem.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalled();
  });
});
