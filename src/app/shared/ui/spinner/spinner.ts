import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  width = input.required<number>();
  height = input.required<number>();
  borderWidth = input<number>(2);
}
