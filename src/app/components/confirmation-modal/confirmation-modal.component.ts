import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationModal } from '../../services/confirmation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="modal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      (click)="onBackdropClick($event)"
    >
      <div 
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <!-- Icon based on type -->
            <div class="flex-shrink-0 mr-4">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                [ngClass]="{
                  'bg-red-100': modal.type === 'danger',
                  'bg-yellow-100': modal.type === 'warning',
                  'bg-blue-100': modal.type === 'info'
                }"
              >
                <!-- Danger Icon -->
                <svg *ngIf="modal.type === 'danger'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                
                <!-- Warning Icon -->
                <svg *ngIf="modal.type === 'warning'" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                
                <!-- Info Icon -->
                <svg *ngIf="modal.type === 'info'" class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">
                {{ modal.title }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-gray-700 leading-relaxed">
            {{ modal.message }}
          </p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            (click)="onCancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {{ modal.cancelText }}
          </button>
          
          <button
            type="button"
            (click)="onConfirm()"
            class="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
            [ngClass]="{
              'bg-red-600 hover:bg-red-700 focus:ring-red-500': modal.type === 'danger',
              'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500': modal.type === 'warning',
              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': modal.type === 'info'
            }"
          >
            {{ modal.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  modal: ConfirmationModal | null = null;
  private subscription?: Subscription;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.modal$.subscribe(
      modal => this.modal = modal
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    this.confirmationService.resolve(true);
  }

  onCancel(): void {
    this.confirmationService.resolve(false);
  }

  onBackdropClick(event: Event): void {
    // Close modal when clicking on backdrop
    this.onCancel();
  }
}
