import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginDto } from '../../../services/auth/auth.service';
import { IconComponent } from '../../../components/icon';

@Component({
  selector: 'app-login-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './login-etablissement.component.html',
  styleUrls: ['./login-etablissement.component.css']
})
export class LoginEtablissementComponent {
  loginData: LoginDto = {
    email: '',
    motDePasse: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.loginEtablissement(this.loginData).subscribe({
        next: (response) => {
          console.log('Connexion établissement réussie:', response);
          this.showToast('Connexion réussie !', 'success');
          setTimeout(() => {
            this.router.navigate(['/dashboard-etablissement']);
          }, 1000);
        },
        error: (error) => {
          console.error('Erreur de connexion établissement:', error);
          this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
          this.showToast(this.errorMessage, 'error');
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
    }, 3000);
  }
}
