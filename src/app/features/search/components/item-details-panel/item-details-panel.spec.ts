import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailsPanel } from './item-details-panel';

describe('ItemDetailsPanel', () => {
  let component: ItemDetailsPanel;
  let fixture: ComponentFixture<ItemDetailsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
