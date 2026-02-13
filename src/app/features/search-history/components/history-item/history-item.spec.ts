import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryItem } from './history-item';

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
});
