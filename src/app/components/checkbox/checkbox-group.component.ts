import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <ng-content></ng-content>
    </div>
  `
})
export class CheckboxGroupComponent {}
