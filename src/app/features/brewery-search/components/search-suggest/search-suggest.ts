import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CustomInput } from '../../../../shared/ui/input/custom-input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Brewery } from '../../models/breweries.interface';
import { ItemDetailsPanel } from '../item-details-panel/item-details-panel';

@Component({
  selector: 'app-search-suggest',
  imports: [
    ReactiveFormsModule,
    CustomInput,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    ItemDetailsPanel,
  ],
  templateUrl: './search-suggest.html',
  styleUrl: './search-suggest.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSuggest implements OnInit {
  /** Host bindings */
  @HostBinding('class.active')
  get isActive() {
    return this.isOpenOverlay();
  }

  /** Inputs */
  items = input.required<Brewery[] | null>();
  minQueryLength = input<number>();
  selectedSearchHistory = input<Brewery | null>(null);
  loading = input<boolean>(true);
  error = input<string>('');
  icon = input<string | null>(null);
  placeHolder = input<string>('');

  /** Outputs */
  brewerySelectChange = output<Brewery | null>();
  detailsPanelClosed = output<void>();
  searchQuery = output<string>();
  openOverlay = output<boolean>(); // consider removing if unused

  /** Dependency Injection */
  private destroyRef = inject(DestroyRef);

  /** Component State (signals) */
  isOpenOverlay = signal(false);
  isOpenDetailsPanel = signal(false);

  /** Component properties */
  selectedBrewery: Brewery | null = null;

  /** Forms */
  protected query = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    effect(() => {
      const selectedSearchHistory = this.selectedSearchHistory();
      if (selectedSearchHistory) {
        this.query.patchValue(selectedSearchHistory.name, { emitEvent: false });
        this.selectedBrewery = selectedSearchHistory;
        this.isOpenOverlay.set(true);
        this.isOpenDetailsPanel.set(true);
      }
    });
    effect(() => {
      const minQueryLength = this.minQueryLength();
      if (minQueryLength) {
        this.query.addValidators(Validators.minLength(minQueryLength));
        this.query.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.query.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: string) => {
      const shouldOpen = !!value && this.query.valid;
      this.isOpenOverlay.set(shouldOpen);
      this.isOpenDetailsPanel.set(false);
      this.searchQuery.emit(value);
    });
  }

  protected selectBrewery(item: Brewery) {
    this.selectedBrewery = item;
    this.brewerySelectChange.emit(item);
    this.isOpenDetailsPanel.set(true);
    this.query.patchValue(item.name, { emitEvent: false });
  }

  protected resetValue() {
    this.brewerySelectChange.emit(null);
    this.isOpenOverlay.set(false);
    this.isOpenDetailsPanel.set(false);
  }

  protected handleCloseDetailsPanel() {
    this.brewerySelectChange.emit(null);
    this.isOpenDetailsPanel.set(false);
    this.detailsPanelClosed.emit();
  }

  protected openDropdown(isFocus: boolean) {
    if (this.query.valid && this.query.value && !this.isOpenOverlay()) {
      this.isOpenOverlay.set(isFocus);
    }
  }
}
