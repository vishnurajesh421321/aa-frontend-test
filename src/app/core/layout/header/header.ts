import { Component } from '@angular/core';
import { Logo } from '../../../shared/ui/logo/logo';

@Component({
  selector: 'app-header',
  imports: [Logo],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {}
