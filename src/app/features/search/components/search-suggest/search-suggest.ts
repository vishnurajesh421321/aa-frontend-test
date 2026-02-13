import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect, HostBinding,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';
import {CustomInput} from '../../../../shared/ui/input/custom-input.component';
import { FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CdkConnectedOverlay, CdkOverlayOrigin} from '@angular/cdk/overlay';
import {Spinner} from '../../../../shared/ui/spinner/spinner';
import {Brewery} from '../../models/breweries.interface';
import {ItemDetailsPanel} from '../item-details-panel/item-details-panel';

@Component({
  selector: 'app-search-suggest',
  imports: [
    ReactiveFormsModule,
    CustomInput,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    Spinner,
    ItemDetailsPanel,
  ],
  templateUrl: './search-suggest.html',
  styleUrl: './search-suggest.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchSuggest implements OnInit{
  @HostBinding('class') overlayHostClass = '';
  formControl = input.required<FormControl>()
  items = input.required<Brewery[] | null>()
  minQueryLength = input<number>();
  selectedSearchHistory = input<Brewery | null>(null);
  selectedBreweryChange = output<Brewery | null>()
  emptyMessage = input<string>();
  loading = input<boolean>(true);
  error = input<string>('');
  onOpenOverlay = output<boolean>()
  onOpenDetailsPanel = output<boolean>()
  icon = input<string | null>(null);
  placeHolder = input<string>('');
  onSearch = output<string>()
  destroyRef = inject(DestroyRef);
  isOpenOverlay = signal(false)
  isOpenDetailsPanel = signal(false)
  selectedBrewery: Brewery | null = null;

  protected query: FormControl = new FormControl('', [Validators.required]);
  constructor() {
    effect(() => {
      if (this.selectedSearchHistory()) {
        this.query.patchValue(this.selectedSearchHistory()?.name, {emitEvent: false});
        this.selectedBrewery = this.selectedSearchHistory();
        this.isOpenOverlay.set(true);
        this.isOpenDetailsPanel.set(true);
      }
    });
    effect(() => {
      if (this.minQueryLength()) {
        this.query.setValidators(Validators.minLength(this.minQueryLength()!))
        this.query.updateValueAndValidity({emitEvent: false});
      }
    })
  }

  ngOnInit() {
    this.query.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe((value: string) => {
      if(value) {
        this.isOpenOverlay.set(true);
        this.isOpenDetailsPanel.set(false)
        this.overlayHostClass = 'active'
      }
      this.onSearch.emit(value);
    })
  }

  protected selectBrewery(item: Brewery) {
    this.selectedBrewery = item;
    this.selectedBreweryChange.emit(item)
    this.isOpenDetailsPanel.set(true);
    this.query.patchValue(item.name, {emitEvent: false});
  }

  protected restValue() {
    this.selectedBreweryChange.emit(null);
    this.isOpenOverlay.set(false);
    this.isOpenDetailsPanel.set(false);
    this.overlayHostClass = ''
  }

  protected onClosePanel() {
    this.selectedBreweryChange.emit(null);
    this.isOpenOverlay.set(true);
    this.isOpenDetailsPanel.set(false);
    this.onOpenDetailsPanel.emit(this.isOpenDetailsPanel())
    this.overlayHostClass = 'active'
  }

  protected openDropdown(isFocus: boolean) {
    if(this.query.value && !this.isOpenOverlay()) {
      this.isOpenOverlay.set(isFocus);
      this.overlayHostClass = isFocus ? 'active': '';
    }
  }
}
