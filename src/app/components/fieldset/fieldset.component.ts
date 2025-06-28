import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fieldset',
  standalone: true,
  imports: [CommonModule],
  template: `
    <fieldset class="space-y-4">
      <ng-content></ng-content>
    </fieldset>
  `
})
export class FieldsetComponent {}
