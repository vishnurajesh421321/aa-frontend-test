import { Component } from '@angular/core';
import { Search } from '../../../features/search/search';

@Component({
  selector: 'app-main-section',
  imports: [Search],
  templateUrl: './main-section.html',
  styleUrl: './main-section.scss',
})
export class MainSection {}
