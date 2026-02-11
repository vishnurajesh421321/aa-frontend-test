import { Component } from '@angular/core';
import {Search} from '../../../features/search/components/search/search';
import {SearchSuggest} from '../../../shared/ui/search-suggest/search-suggest';

@Component({
  selector: 'app-main-section',
  imports: [
    Search,
  ],
  templateUrl: './main-section.html',
  styleUrl: './main-section.scss',
})
export class MainSection {

}
