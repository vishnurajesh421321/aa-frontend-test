import { Component } from '@angular/core';
import {Input} from '../../../../shared/ui/input/input';
import {SearchSuggest} from '../../../../shared/ui/search-suggest/search-suggest';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [
    SearchSuggest
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
   items = [
     { name: "(405) Brewing Co" },
     { name: "(512) Brewing Co" },
     { name: "1 of Us Brewing Company" }
   ];
  protected selectedItem: FormControl = new FormControl();
}
