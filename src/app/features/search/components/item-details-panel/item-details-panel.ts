import {Component, input, output} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Brewery} from '../../../models/breweries.interface';
type PanelState = 'open' | 'closed';

@Component({
  selector: 'app-item-details-panel',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './item-details-panel.html',
  styleUrl: './item-details-panel.scss',
})
export class ItemDetailsPanel {
   brewery = input.required<Brewery>();
   onClose = output<PanelState>()

  protected closePanel() {
    this.onClose.emit('closed')
  }
}
