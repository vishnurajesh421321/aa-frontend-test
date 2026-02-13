import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Brewery } from '../../models/breweries.interface';
import { Icon } from '../../../../shared/ui/icon/icon';
type PanelState = 'open' | 'closed';

@Component({
  selector: 'app-item-details-panel',
  imports: [Icon],
  templateUrl: './item-details-panel.html',
  styleUrl: './item-details-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailsPanel {
  brewery = input.required<Brewery | null>();
  panelState = input<PanelState>('closed');
  panelStateChange = output<PanelState>();

  protected closePanel() {
    this.panelStateChange.emit('closed');
  }
}
