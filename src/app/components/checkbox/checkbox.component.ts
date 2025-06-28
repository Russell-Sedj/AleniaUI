import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input 
      type="checkbox" 
      [id]="inputId"
      [name]="name"
      [value]="value"
      [checked]="isChecked"
      [disabled]="disabled"
      (change)="onCheckboxChange($event)"
      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2">
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() defaultChecked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() inputId: string = '';

  isChecked: boolean = false;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.isChecked = this.defaultChecked;
  }

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;
    this.onChange(this.isChecked);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.isChecked = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
