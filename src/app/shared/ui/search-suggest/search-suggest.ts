import {
  Component,
  computed,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';
import {Input} from '../input/input';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgClass} from '@angular/common';
import {CdkConnectedOverlay, CdkOverlayOrigin} from '@angular/cdk/overlay';
import {Spinner} from '../spinner/spinner';

@Component({
  selector: 'app-search-suggest',
  imports: [
    ReactiveFormsModule,
    Input,
    NgClass,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    Spinner,
  ],
  templateUrl: './search-suggest.html',
  styleUrl: './search-suggest.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    }
  ]
})
export class SearchSuggest<TItem> implements ControlValueAccessor, OnInit {
  formControl = input.required<FormControl>()
  items = input.required<TItem[] | null>()
  itemKey = input.required<string>();
  optionLabel = input<string>();
  emptyMessage = input<string>();
  optionKey = input<string>();
  loading = input<boolean>(true);
  optionKeyAsKeyOf: keyof TItem | null = null;
  OptionLabelAsKeyOf : keyof TItem | null = null;
  key = computed(() => this.itemKey) as unknown as keyof TItem;
  onOpen = output<boolean>()
  inputType = input<'text' | 'password' | 'email'>('text');
  icon = input<string | null>(null);
  placeHolder = input<string>('');
  onSearch = output<string>()
  value: TItem | null = null
  disabled = false;
  destroyRef = inject(DestroyRef);
  isOpen = signal(false)

  protected onChange = (value: TItem | string | number) => {};
  protected query: FormControl = new FormControl('');
  constructor() {
    effect(() => {
      this.OptionLabelAsKeyOf = this.optionLabel() as unknown as keyof TItem;
      this.optionKeyAsKeyOf = this.optionKey() as unknown as keyof TItem;
    })
  }

  ngOnInit() {
    this.query.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.onSearch.emit(value);
      if(value) {
        this.isOpen.set(true)
      }
    })
  }

  writeValue(value: TItem | null): void {
    this.value = value ?? null;
  }
  registerOnChange(fn: (value: TItem | string | number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onChange = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected handleOnChange(item: TItem) {
    if(this.optionKeyAsKeyOf) {
      this.onChange(item[this.optionKeyAsKeyOf] as TItem);
    } else {
      this.onChange(item);
    }
  }
}
