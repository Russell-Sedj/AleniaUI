import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <legend class="text-lg font-semibold text-gray-900 mb-2">
      <ng-content></ng-content>
    </legend>
  `
})
export class LegendComponent {}
