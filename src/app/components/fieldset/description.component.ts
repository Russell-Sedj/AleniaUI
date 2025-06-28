import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-sm text-gray-600 mt-1">
      <ng-content></ng-content>
    </p>
  `
})
export class DescriptionComponent {}
