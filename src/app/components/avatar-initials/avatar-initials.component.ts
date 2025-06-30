import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-initials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="rounded-full flex items-center justify-center text-white font-semibold"
      [class]="avatarClass"
      [title]="fullName">
      {{ initials }}
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AvatarInitialsComponent {
  @Input() fullName: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() backgroundColor: string = 'bg-gray-600';

  get initials(): string {
    if (!this.fullName) return '';
    
    return this.fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  get avatarClass(): string {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg'
    };

    return `${sizeClasses[this.size]} ${this.backgroundColor}`;
  }
}
