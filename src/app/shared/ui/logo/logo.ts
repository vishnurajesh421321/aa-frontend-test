import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  imports: [
    NgOptimizedImage
  ]
})
export class Logo {
   width = input.required<number>()
   height = input.required<number>()
}
