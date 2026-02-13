import { Component } from '@angular/core';
import { Header } from './core/layout/header/header';
import { MainSection } from './core/layout/main-section/main-section';

@Component({
  selector: 'app-root',
  imports: [Header, MainSection],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
