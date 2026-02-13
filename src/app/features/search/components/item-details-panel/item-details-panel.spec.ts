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
    fixture.componentRef.setInput('brewery', null);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have default panelState as closed', () => {
    expect(component.panelState()).toBe('closed');
  });
  it('should emit as "closed" when close panel', () => {
    const signalOutputSpy = vi.spyOn(component.panelStateChange, 'emit');
    (component as any).closePanel();
    expect(signalOutputSpy).toHaveBeenCalledWith('closed');
  });
  it('should accept panelState input value', () => {
    fixture.componentRef.setInput('panelState', 'open');
    fixture.detectChanges();

    expect(component.panelState()).toBe('open');
  });
});
