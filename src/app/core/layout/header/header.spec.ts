import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { Logo } from '../../../shared/ui/logo/logo';
import { By } from '@angular/platform-browser';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have logo text "SEARCH"', () => {
    const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(heading.textContent.trim()).toBe('SEARCH');
  });
  it('should pass logo dimensions', () => {
    const logoDebugElement = fixture.debugElement.query(By.directive(Logo));
    const logoComponent = logoDebugElement.componentInstance as Logo;

    expect(logoComponent.width()).toBe(40);
    expect(logoComponent.height()).toBe(60);
  });
});
