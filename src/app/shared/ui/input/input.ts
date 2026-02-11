import {Component, forwardRef, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    }
  ]
})
export class Input implements ControlValueAccessor {
   inputType = input<'text' | 'password' | 'email'>('text');
   icon = input<string | null>(null);
   placeHolder = input<string>('');

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
    console.log('value', value);
    this.onChange(value);
    this.writeValue(value)
  }

  protected handleBlur() {
    this.onTouched()
  }
}
