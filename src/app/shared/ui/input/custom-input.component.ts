import {Component, forwardRef, input, output} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true
    }
  ]
})
export class CustomInput implements ControlValueAccessor {
   inputType = input<'text' | 'password' | 'email'>('text');
   icon = input<string | null>(null);
   placeHolder = input<string>('');
   onFocus = output<boolean>()
   isFocused = false;
   value = '';
   disabled = false;

  private onChange = (value: string) => {};
  protected onTouched = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  protected handleBlur() {
    this.onTouched()
    this.isFocused = false;
    this.onFocus.emit(this.isFocused);
  }

  protected handleFocus() {
    this.isFocused = true;
    this.onFocus.emit(this.isFocused);
  }
}
