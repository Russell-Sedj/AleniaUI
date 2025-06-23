import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterDto } from '../../services/auth/auth.service';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData: RegisterFormData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    countryCode: '+33',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  };

  isLoading = false;

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid || this.formData.password !== this.formData.confirmPassword) {
      this.markFormGroupTouched(form);
      this.showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    this.isLoading = true;

    try {      const registerModel: RegisterDto = {
        email: this.formData.email.trim(),
        motDePasse: this.formData.password,
        confirmMotDePasse: this.formData.confirmPassword,
        nom: this.formData.lastName.trim(),
        prenom: this.formData.firstName.trim(),
        telephone: this.formData.countryCode + this.formData.phoneNumber.trim(),
        adresse: '', // Vide au lieu d'undefined
        competences: [], // Tableau vide au lieu d'undefined  
        disponibilites: '' // Vide au lieu d'undefined
      };      this.authService.register(registerModel).subscribe({
        next: (response) => {
          console.log('Inscription réussie, réponse:', response);
          
          // Connecter automatiquement l'utilisateur après l'inscription
          const loginData = {
            email: this.formData.email.trim(),
            motDePasse: this.formData.password
          };
          
          this.authService.login(loginData).subscribe({
            next: (loginResponse) => {
              console.log('Connexion automatique réussie:', loginResponse);
              this.showToast('Inscription réussie ! Vous êtes maintenant connecté.', 'success');
              setTimeout(() => {
                this.router.navigate(['/dashboard-interimaire']);
              }, 2000);
            },
            error: (loginError) => {
              console.error('Erreur lors de la connexion automatique:', loginError);
              this.showToast('Inscription réussie ! Veuillez vous connecter.', 'success');
              setTimeout(() => {
                this.router.navigate(['/connexion']);
              }, 2000);
            }
          });
        },error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.error) {
              errorMessage = error.error.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.showToast(errorMessage, 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      this.showToast(
        error.message || 'Une erreur est survenue. Veuillez réessayer.',
        'error'
      );
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 transform transition-all duration-300 translate-x-full opacity-0`;
    toast.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            ${type === 'success' 
              ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>'
              : type === 'error'
              ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>'
              : '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>'
            }
          </svg>
          <span>${message}</span>
        </div>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;

    container.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // Suppression automatique après 5 secondes
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
  }
}
