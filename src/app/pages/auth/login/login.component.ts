import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: string = '';

  model: { email: string; motDePass: string } = {
    email: '',
    motDePass: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Tentative de connexion avec:', this.model);
      this.authService.login(this.model).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur détaillée:', error);
          this.errorMessage = error.error.message || 'Erreur de connexion';
        },
      });
    }
  }
}
