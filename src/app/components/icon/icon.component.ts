import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [class]="iconClass" 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg">
      <ng-container [ngSwitch]="name">
        <!-- Mission Icon -->
        <path *ngSwitchCase="'mission'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        
        <!-- Clipboard Icon -->
        <path *ngSwitchCase="'clipboard'" d="m17 21l-2.75-3l1.16-1.16L17 18.43l3.59-3.59l1.16 1.41M12.8 21H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h14a2 2 0 0 1 2 2v7.8c-.88-.51-1.91-.8-3-.8l-1 .08V11H7v2h7.69A5.98 5.98 0 0 0 12 18c0 1.09.29 2.12.8 3m-.8-6H7v2h5m5-10H7v2h10"></path>
        
        <!-- Chart Icon -->
        <path *ngSwitchCase="'chart'" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        
        <!-- Users Icon -->
        <path *ngSwitchCase="'users'" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"></path>
        
        <!-- Star Icon -->
        <path *ngSwitchCase="'star'" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        
        <!-- Email Icon -->
        <path *ngSwitchCase="'email'" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        
        <!-- Check Icon -->
        <path *ngSwitchCase="'check'" d="M3 3v19l3-2l3 2l3-2l1.3.86c-.2-.58-.3-1.21-.3-1.86a6.005 6.005 0 0 1 8-5.66V3zm14 4v2H7V7zm-2 4v2H7v-2zm.5 8l2.75 3L23 17.23l-1.16-1.41l-3.59 3.59l-1.59-1.59z"></path>
        
        <!-- X Icon -->
        <path *ngSwitchCase="'x'" d="M6 18L18 6M6 6l12 12"></path>
        
        <!-- Target Icon -->
        <circle *ngSwitchCase="'target'" cx="12" cy="12" r="10"></circle>
        <circle *ngSwitchCase="'target'" cx="12" cy="12" r="6"></circle>
        <circle *ngSwitchCase="'target'" cx="12" cy="12" r="2"></circle>
        
        <!-- Trending Up Icon -->
        <path *ngSwitchCase="'trending-up'" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        
        <!-- Trending Down Icon -->
        <path *ngSwitchCase="'trending-down'" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
        
        <!-- Document Icon -->
        <path *ngSwitchCase="'document'" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        
        <!-- Default fallback -->
        <circle *ngSwitchDefault cx="12" cy="12" r="10"></circle>
      </ng-container>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: string = 'text-gray-500';

  get iconClass(): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    return `${sizeClasses[this.size]} ${this.color}`;
  }
}
