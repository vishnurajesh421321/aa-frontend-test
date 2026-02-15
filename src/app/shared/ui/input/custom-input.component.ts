import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Spinner } from '../spinner/spinner';
import { IconType } from '../../../core/types/icon.type';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-input',
  imports: [Spinner, Icon],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true,
    },
  ],
})
export class CustomInput implements ControlValueAccessor {
  /** Inputs */
  inputType = input<'text' | 'password' | 'email'>('text');
  icon = input<IconType | null>(null);
  placeHolder = input<string>('');
  clearable = input<boolean>(false);
  loading = input<boolean>(true);
  ariaLabel = input<string>('Search input');

  /** Outputs */
  focusChange = output<boolean>();

  /** Component State */
  isFocused = signal<boolean>(false);
  value = signal<string>('');
  disabled = signal<boolean>(false);

  /** ControlValueAccessor callbacks */
  private inputOnChange!: (value: string) => void;
  protected inputOnTouched!: () => void;

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.inputOnChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.inputOnTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  handleInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
    this.inputOnChange(this.value());
  }

  protected handleBlur() {
    this.inputOnTouched();
    this.isFocused.set(false);
    this.focusChange.emit(this.isFocused());
  }

  protected handleFocus() {
    this.isFocused.set(true);
    this.focusChange.emit(this.isFocused());
  }

  protected handleButtonActions(input: HTMLInputElement) {
    if (this.clearable() && this.value) {
      this.value.set('');
      this.inputOnChange(this.value());
    }
    input.focus();
  }
}
