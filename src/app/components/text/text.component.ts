import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-sm text-gray-600 mb-4">
      <ng-content></ng-content>
    </p>
  `
})
export class TextComponent {}
