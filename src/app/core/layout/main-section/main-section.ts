import { Component } from '@angular/core';
import { BrewerySearch } from '../../../features/brewery-search/brewery-search';

@Component({
  selector: 'app-main-section',
  imports: [BrewerySearch],
  templateUrl: './main-section.html',
  styleUrl: './main-section.scss',
})
export class MainSection {}
