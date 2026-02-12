import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuggest } from './search-suggest';
import {Brewery} from '../../../models/breweries.interface';

describe('SearchSuggest', () => {
  let component: SearchSuggest<Brewery>;
  let fixture: ComponentFixture<SearchSuggest<Brewery>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSuggest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSuggest<Brewery>);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
