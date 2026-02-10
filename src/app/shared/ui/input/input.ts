import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
   inputType = input<'text' | 'password' | 'email'>('text');
   icon = input<string | null>(null);
   placeHolder = input<string>('');
}
