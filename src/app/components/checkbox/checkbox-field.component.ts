import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-start space-x-3 py-3">
      <ng-content></ng-content>
    </div>
  `
})
export class CheckboxFieldComponent {}
