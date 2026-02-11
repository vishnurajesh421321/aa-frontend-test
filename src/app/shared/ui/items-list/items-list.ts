import {Component, computed, input, output} from '@angular/core';

@Component({
  selector: 'app-items-list',
  imports: [],
  templateUrl: './items-list.html',
  styleUrl: './items-list.scss',
})
export class ItemsList<TItem> {
  items = input.required<(TItem)[]>();
  key = input.required<string>() ;
  trackKey = computed(() => this.key()) as unknown as keyof TItem;
  selectedItem = output<TItem>()
  protected handleSelect(item: TItem) {
    this.selectedItem.emit(item)
  }
}
