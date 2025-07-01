import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterimaireGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('🛡️ InterimaireGuard - Vérification accès intérimaire');
    
    // D'abord initialiser le contexte utilisateur intérimaire
    this.authService.initializeUserContext('interimaire');
    
    // Vérifier si l'utilisateur est connecté et est bien un intérimaire
    if (this.authService.isAuthenticated() && this.authService.isUserType('interimaire')) {
      console.log('✅ Accès intérimaire autorisé');
      return true;
    }
    
    // Si l'utilisateur est connecté mais en tant qu'établissement
    if (this.authService.isAuthenticated() && this.authService.isUserType('etablissement')) {
      console.log('❌ Utilisateur établissement tente d\'accéder à une page intérimaire');
      this.router.navigate(['/dashboard-etablissement']);
      return false;
    }
    
    // Sinon rediriger vers la connexion
    console.log('❌ Utilisateur non connecté - redirection vers connexion');
    this.router.navigate(['/connexion']);
    return false;
  }
}
