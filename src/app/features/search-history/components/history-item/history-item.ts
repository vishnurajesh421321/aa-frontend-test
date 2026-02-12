import {Component, input, output} from '@angular/core';
import {Icon} from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-history-item',
  imports: [
    Icon
  ],
  templateUrl: './history-item.html',
  styleUrl: './history-item.scss',
})
export class HistoryItem {
    title = input.required<string>()
    date = input.required<string>()
    onRemove = output<string>()

  protected handleOnRemove() {
    this.onRemove.emit(this.title())
  }
}
