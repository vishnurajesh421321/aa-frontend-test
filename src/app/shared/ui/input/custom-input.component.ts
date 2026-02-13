import { Component, forwardRef, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-input',
  imports: [NgOptimizedImage, Spinner],
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
  inputType = input<'text' | 'password' | 'email'>('text');
  icon = input<string | null>(null);
  placeHolder = input<string>('');
  clearable = input<boolean>(false);
  loading = input<boolean>(true);
  focusChange = output<boolean>();
  isFocused = false;
  value = '';
  disabled = false;

  private inputOnChange!: (value: string) => void;
  protected inputOnTouched!: () => void;

  writeValue(value: string): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.inputOnChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.inputOnTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  handleInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.inputOnChange(this.value);
  }

  protected handleBlur() {
    this.inputOnTouched();
    this.isFocused = false;
    this.focusChange.emit(this.isFocused);
  }

  protected handleFocus() {
    this.isFocused = true;
    this.focusChange.emit(this.isFocused);
  }

  protected handleButtonActions(input: HTMLInputElement) {
    if (this.clearable() && this.value) {
      this.value = '';
      this.inputOnChange(this.value);
    } else {
      input.focus();
    }
  }
}
