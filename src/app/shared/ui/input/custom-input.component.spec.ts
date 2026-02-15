import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { CustomInput } from './custom-input.component';

describe('CustomInput', () => {
  let component: CustomInput;
  let fixture: ComponentFixture<CustomInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('writes value and falls back to empty string for nullish values', () => {
    component.writeValue('abc');
    expect(component.value()).toBe('abc');

    component.writeValue(undefined as unknown as string);
    expect(component.value()).toBe('');
  });

  it('registers callbacks and handles input updates', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    component.handleInput({ target: { value: 'typed' } } as unknown as Event);

    expect(component.value()).toBe('typed');
    expect(onChange).toHaveBeenCalledWith('typed');
  });

  it('registers touched callback and handles blur', () => {
    const onTouched = vi.fn();
    const focusSpy = vi.spyOn(component.focusChange, 'emit');
    component.registerOnTouched(onTouched);
    component.isFocused.set(true);

    (component as any).handleBlur();

    expect(onTouched).toHaveBeenCalled();
    expect(component.isFocused()).toBe(false);
    expect(focusSpy).toHaveBeenCalledWith(false);
  });

  it('handles focus event', () => {
    const focusSpy = vi.spyOn(component.focusChange, 'emit');

    (component as any).handleFocus();

    expect(component.isFocused()).toBe(true);
    expect(focusSpy).toHaveBeenCalledWith(true);
  });

  it('sets disabled state', () => {
    component.setDisabledState?.(true);
    expect(component.disabled()).toBe(true);

    component.setDisabledState?.(false);
    expect(component.disabled()).toBe(false);
  });

  it('clears value when clearable and there is a value', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    fixture.componentRef.setInput('clearable', true);
    component.value.set('filled');

    (component as any).handleButtonActions({ focus: vi.fn() } as unknown as HTMLInputElement);

    expect(component.value()).toBe('');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('focuses input when value cannot be cleared', () => {
    const onChange = vi.fn();
    const focus = vi.fn();
    component.registerOnChange(onChange);
    fixture.componentRef.setInput('clearable', false);
    component.value.set('brewery');

    (component as any).handleButtonActions({ focus } as unknown as HTMLInputElement);

    expect(focus).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
