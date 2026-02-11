import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuggest } from './search-suggest';

describe('SearchSuggest', () => {
  let component: SearchSuggest;
  let fixture: ComponentFixture<SearchSuggest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSuggest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSuggest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
