import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterEtablissementDto } from '../../../services/auth/auth.service';
import { IconComponent } from '../../../components/icon';

@Component({
  selector: 'app-inscription-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './inscription-etablissement.component.html',
  styleUrls: ['./inscription-etablissement.component.css']
})
export class InscriptionEtablissementComponent {
  formData: RegisterEtablissementDto = {
    email: '',
    motDePasse: '',
    confirmMotDePasse: '',
    nom: '',
    responsable: '',
    adresse: '',
    telephone: '',
    typeEtablissement: '',
    numeroSiret: '',
    description: ''
  };

  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  emailExists: boolean = false;
  isCheckingEmail: boolean = false;

  typesEtablissement = [
    { value: 'hopital', label: 'Hôpital' },
    { value: 'clinique', label: 'Clinique' },
    { value: 'ehpad', label: 'EHPAD' },
    { value: 'maison_retraite', label: 'Maison de retraite' },
    { value: 'centre_soins', label: 'Centre de soins' },
    { value: 'cabinet_medical', label: 'Cabinet médical' },
    { value: 'autre', label: 'Autre' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: any): void {
    if (form.valid && !this.emailExists) {
      this.isLoading = true;

      this.authService.registerEtablissement(this.formData).subscribe({
        next: (response) => {
          console.log('Inscription établissement réussie:', response);
          this.showToast('Inscription réussie ! Redirection vers la connexion...', 'success');
          setTimeout(() => {
            this.router.navigate(['/connexion-etablissement']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          let errorMessage = 'Une erreur est survenue lors de l\'inscription';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            const errors = Object.values(error.error.errors).flat();
            errorMessage = errors[0] as string;
          }
          
          this.showToast(errorMessage, 'error');
          this.isLoading = false;
        }
      });
    }
  }

  onEmailChange(): void {
    if (this.formData.email && this.formData.email.includes('@')) {
      this.isCheckingEmail = true;
      this.authService.checkEmailExists(this.formData.email).subscribe({
        next: (response) => {
          this.emailExists = response.exists;
          this.isCheckingEmail = false;
        },
        error: () => {
          this.isCheckingEmail = false;
        }
      });
    } else {
      this.emailExists = false;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  isPasswordValid(): boolean {
    return this.formData.motDePasse.length >= 8 &&
           /[A-Z]/.test(this.formData.motDePasse) &&
           /[a-z]/.test(this.formData.motDePasse) &&
           /\d/.test(this.formData.motDePasse);
  }

  // Getters pour la validation du mot de passe dans le template
  get hasValidLength(): boolean {
    return this.formData.motDePasse.length >= 8;
  }

  get hasUpperLowerCase(): boolean {
    return /[A-Z]/.test(this.formData.motDePasse) && /[a-z]/.test(this.formData.motDePasse);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.formData.motDePasse);
  }

  doPasswordsMatch(): boolean {
    return this.formData.motDePasse === this.formData.confirmMotDePasse;
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 transition-all duration-300 transform translate-x-full ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(full)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 4000);
  }
}
