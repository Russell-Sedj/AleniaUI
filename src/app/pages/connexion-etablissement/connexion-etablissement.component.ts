import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-connexion-etablissement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <!-- Connexion Établissement - Modern Design -->
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <img src="/assets/images/logo.png" alt="ALENIA" class="mx-auto h-16 w-auto">
          <h2 class="mt-6 text-3xl font-bold text-gray-900">
            Espace Établissement
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Connectez-vous à votre espace de gestion
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email de l'établissement
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="nom@etablissement.com"
              >
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-sm text-red-600">
                Email requis et valide
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              >
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-sm text-red-600">
                Mot de passe requis
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Pas encore d'espace établissement ?
              <a routerLink="/inscription-etablissement" class="font-medium text-blue-600 hover:text-blue-500">
                Créer un compte
              </a>
            </p>
          </div>

          <div class="mt-4 text-center">
            <a routerLink="/connexion" class="text-sm text-gray-500 hover:text-gray-700">
              ← Espace intérimaire
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConnexionEtablissementComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      // Pour l'instant, on fait une connexion simple avec validation côté client
      // Dans un vrai système, on ferait appel à l'API d'authentification
      
      // Simulation d'une connexion établissement
      if (email.includes('@etablissement.') || email.includes('admin') || email.includes('etablissement')) {
        // Simulation d'un token et user pour établissement
        localStorage.setItem('token', 'etablissement-token-' + Date.now());
        localStorage.setItem('currentUser', JSON.stringify({
          id: 'etab-' + Date.now(),
          email: email,
          type: 'etablissement',
          nom: 'Établissement Test'
        }));
        
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/dashboard-etablissement']);
        }, 1000);
      } else {
        setTimeout(() => {
          this.isLoading = false;
          this.errorMessage = 'Email ou mot de passe incorrect pour un établissement';
        }, 1000);
      }
    }
  }
}
