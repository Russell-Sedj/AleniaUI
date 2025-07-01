import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  template: `
    <aside class="flex w-64 flex-col bg-gray-900 border-r border-gray-800 shadow-lg lg:fixed lg:inset-y-0 lg:z-50">
      <!-- Header avec logo -->
      <div class="flex items-center gap-3 p-6 border-b border-gray-800">
        <img [src]="logoSrc" [alt]="companyName" class="w-10 h-10">
        <div>
          <h2 class="text-lg font-semibold text-white">{{ companyName }}</h2>
          <p class="text-sm text-gray-400">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-1">
          <li *ngFor="let item of navigationItems">
            <button 
              (click)="onItemClick(item)"
              [class]="getItemClasses(item)"
              class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200">
              <div [innerHTML]="getSafeIcon(item.icon)" class="w-5 h-5 flex-shrink-0"></div>
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>

        <!-- Spacer pour pousser la déconnexion en bas -->
        <div class="flex-1 min-h-8"></div>

        <!-- Déconnexion -->
        <div class="border-t border-gray-800 pt-4 mt-4" *ngIf="showLogout">
          <button 
            (click)="onLogout()"
            class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      <!-- Footer avec profil utilisateur -->
      <div class="border-t border-gray-800 p-4" *ngIf="userProfile">
        <div class="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <app-avatar 
            [initials]="userProfile.initials" 
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          </app-avatar>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-white truncate">{{ userProfile.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ userProfile.email }}</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() logoSrc = '/assets/images/logo.png';
  @Input() companyName = 'ALENIA';
  @Input() subtitle = 'Espace Intérimaire';
  @Input() navigationItems: NavigationItem[] = [];
  @Input() activeItem: string = '';
  @Input() userProfile: UserProfile | null = null;
  @Input() showLogout = true;
  
  @Output() itemClick = new EventEmitter<NavigationItem>();
  @Output() logout = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  onItemClick(item: NavigationItem) {
    this.itemClick.emit(item);
  }

  onLogout() {
    this.logout.emit();
  }

  getItemClasses(item: NavigationItem): string {
    const baseClasses = '';
    if (item.id === this.activeItem) {
      return `${baseClasses} bg-blue-600 text-white border-r-2 border-blue-400 font-semibold shadow-md`;
    }
    return `${baseClasses} text-gray-300 hover:bg-gray-800 hover:text-white`;
  }
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string; // HTML string pour l'icône SVG
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
}
