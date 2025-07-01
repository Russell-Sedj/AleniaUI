import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmationModal extends ConfirmationOptions {
  id: string;
  resolve: (result: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private modalSubject = new BehaviorSubject<ConfirmationModal | null>(null);
  public modal$ = this.modalSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const modal: ConfirmationModal = {
        id: this.generateId(),
        title: options.title || 'Confirmation',
        message: options.message,
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        type: options.type || 'info',
        resolve
      };

      this.modalSubject.next(modal);
    });
  }

  resolve(result: boolean): void {
    const currentModal = this.modalSubject.value;
    if (currentModal) {
      currentModal.resolve(result);
      this.modalSubject.next(null);
    }
  }

  close(): void {
    const currentModal = this.modalSubject.value;
    if (currentModal) {
      currentModal.resolve(false);
      this.modalSubject.next(null);
    }
  }
}
