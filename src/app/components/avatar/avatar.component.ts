import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getAvatarClasses()">
      {{ initials }}
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AvatarComponent {
  @Input() initials: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() className: string = '';

  getAvatarClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium select-none';
    
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    const defaultClasses = 'bg-gray-500 text-white';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${this.className || defaultClasses}`;
  }
}
