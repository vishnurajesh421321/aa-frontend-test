import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-history-item',
  imports: [Icon],
  templateUrl: './history-item.html',
  styleUrl: './history-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryItem {
  title = input.required<string>();
  date = input.required<string>();
  remove = output<string>();

  protected handleOnRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit(this.title());
  }
}
