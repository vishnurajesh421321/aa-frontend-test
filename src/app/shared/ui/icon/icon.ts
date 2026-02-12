import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {IconType} from '../../../core/types/icon.type';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  imports: [
    NgOptimizedImage
  ]
})
export class Icon {
  icon = input.required<IconType>()
  width = input<number>(20)
  height = input<number>(20)
}
