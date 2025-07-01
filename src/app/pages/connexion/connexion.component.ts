import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginDto } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, NotificationComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private notificationService: NotificationService) {}
  loginModel: LoginDto = {
    email: '',
    motDePasse: ''
  };
  isLoading = false;
  showPassword = false;
  rememberMe = false;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signInWithGoogle(): void {
    this.notificationService.info('Connexion Google en cours...');
    // TODO: Implémenter la connexion Google
    console.log('Connexion Google demandée');
  }

  signInWithLinkedIn(): void {
    this.notificationService.info('Connexion LinkedIn en cours...');
    // TODO: Implémenter la connexion LinkedIn
    console.log('Connexion LinkedIn demandée');
  }
  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      this.markFormGroupTouched(form);
      this.notificationService.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.isLoading = true;

    try {      const trimmedLoginModel: LoginDto = {
        email: this.loginModel.email.trim(),
        motDePasse: this.loginModel.motDePasse
      };

      this.authService.login(trimmedLoginModel).subscribe({
        next: (response) => {
          this.notificationService.success('Connexion réussie ! Redirection en cours...');
          this.isLoading = false;
          setTimeout(() => {
            // Rediriger vers le dashboard intérimaire
            this.router.navigate(['/dashboard-interimaire']);
          }, 1500);
        },
        error: (error) => {
          console.error('Erreur lors de la connexion:', error);
          let errorMessage = 'Email ou mot de passe incorrect';
          
          if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 0) {
            errorMessage = 'Impossible de se connecter au serveur';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.notificationService.error(errorMessage);
          this.isLoading = false; // Remettre à false immédiatement après l'erreur
        }
      });
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      this.notificationService.error('Une erreur est survenue. Veuillez réessayer.');
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
  }
}
