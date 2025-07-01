import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EtablissementGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('🛡️ EtablissementGuard - Vérification accès établissement');
    
    // D'abord initialiser le contexte utilisateur établissement
    this.authService.initializeUserContext('etablissement');
    
    // Vérifier si l'utilisateur est connecté et est bien un établissement
    if (this.authService.isAuthenticated() && this.authService.isUserType('etablissement')) {
      console.log('✅ Accès établissement autorisé');
      return true;
    }
    
    // Si l'utilisateur est connecté mais en tant qu'intérimaire
    if (this.authService.isAuthenticated() && this.authService.isUserType('interimaire')) {
      console.log('❌ Utilisateur intérimaire tente d\'accéder à une page établissement');
      this.router.navigate(['/dashboard-interimaire']);
      return false;
    }
    
    // Sinon rediriger vers la connexion
    console.log('❌ Utilisateur non connecté - redirection vers connexion');
    this.router.navigate(['/connexion-etablissement']);
    return false;
  }
}
