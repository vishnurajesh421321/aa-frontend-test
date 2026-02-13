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
  @HostBinding('class') overlayHostClass = '';
  items = input.required<Brewery[] | null>();
  minQueryLength = input<number>();
  selectedSearchHistory = input<Brewery | null>(null);
  brewerySelectChange = output<Brewery | null>();
  loading = input<boolean>(true);
  error = input<string>('');
  openOverlay = output<boolean>();
  closeDetailsPanel = output<boolean>();
  icon = input<string | null>(null);
  placeHolder = input<string>('');
  searchQuery = output<string>();
  destroyRef = inject(DestroyRef);
  isOpenOverlay = signal(false);
  isOpenDetailsPanel = signal(false);
  selectedBrewery: Brewery | null = null;

  protected query: FormControl = new FormControl('', [Validators.required]);
  constructor() {
    effect(() => {
      if (this.selectedSearchHistory()) {
        this.query.patchValue(this.selectedSearchHistory()?.name, { emitEvent: false });
        this.selectedBrewery = this.selectedSearchHistory();
        this.isOpenOverlay.set(true);
        this.isOpenDetailsPanel.set(true);
      }
    });
    effect(() => {
      if (this.minQueryLength()) {
        this.query.setValidators(Validators.minLength(this.minQueryLength()!));
        this.query.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.query.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: string) => {
      const shouldOpen = !!value && this.query.valid;
      this.isOpenOverlay.set(shouldOpen);
      this.isOpenDetailsPanel.set(false);
      this.overlayHostClass = shouldOpen ? 'active' : '';
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
    this.overlayHostClass = '';
  }

  protected onClosePanel() {
    this.brewerySelectChange.emit(null);
    this.isOpenOverlay.set(true);
    this.isOpenDetailsPanel.set(false);
    this.closeDetailsPanel.emit(this.isOpenDetailsPanel());
    this.overlayHostClass = 'active';
  }

  protected openDropdown(isFocus: boolean) {
    if (this.query.valid && this.query.value && !this.isOpenOverlay()) {
      this.isOpenOverlay.set(isFocus);
      this.overlayHostClass = isFocus ? 'active' : '';
    }
  }
}
