import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginDto } from '../../../services/auth/auth.service';
import { IconComponent } from '../../../components/icon';
import { NotificationService } from '../../../services/notification.service';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-login-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, NotificationComponent],
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
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.loginEtablissement(this.loginData).subscribe({
        next: (response) => {
          console.log('Connexion établissement réussie:', response);
          this.notificationService.success('Connexion réussie !');
          setTimeout(() => {
            this.router.navigate(['/dashboard-etablissement']);
          }, 1000);
        },
        error: (error) => {
          console.error('Erreur de connexion établissement:', error);
          this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
          this.notificationService.error(this.errorMessage);
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
