import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';
import {Input} from '../../../../shared/ui/input/input';
import { FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { NgClass} from '@angular/common';
import {CdkConnectedOverlay, CdkOverlayOrigin} from '@angular/cdk/overlay';
import {Spinner} from '../../../../shared/ui/spinner/spinner';
import {Brewery} from '../../models/breweries.interface';
import {ItemDetailsPanel} from '../item-details-panel/item-details-panel';

@Component({
  selector: 'app-search-suggest',
  imports: [
    ReactiveFormsModule,
    Input,
    NgClass,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    Spinner,
    ItemDetailsPanel,
  ],
  templateUrl: './search-suggest.html',
  styleUrl: './search-suggest.scss',
})
export class SearchSuggest implements OnInit {
  formControl = input.required<FormControl>()
  items = input.required<Brewery[] | null>()
  minQueryLength = input<number>();
  emptyMessage = input<string>();
  loading = input<boolean>(true);
  error = input<string>('');
  onOpen = output<boolean>()
  onSelectBrewery = output<Brewery>()
  inputType = input<'text' | 'password' | 'email'>('text');
  icon = input<string | null>(null);
  placeHolder = input<string>('');
  onSearch = output<string>()
  selectedBrewery: Brewery | null = null
  destroyRef = inject(DestroyRef);
  isOpen = signal(false)

  protected query: FormControl = new FormControl('', [Validators.required]);
  constructor() {
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
        if(!this.query.invalid) {
          this.onSearch.emit(value);
        }
        this.isOpen.set(true)
      }
    })
  }

  protected selectBrewery(item: Brewery) {
    this.selectedBrewery = item;
    this.onSelectBrewery.emit(item)
  }

  protected restValue() {
    this.selectedBrewery = null;
  }

  protected onClosePanel() {
    this.selectedBrewery = null;
    this.isOpen.set(true);
  }
}
