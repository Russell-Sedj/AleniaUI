import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [for]="htmlFor" class="text-sm font-medium text-gray-900">
      <ng-content></ng-content>
    </label>
  `
})
export class LabelComponent {
  @Input() htmlFor: string = '';
}
