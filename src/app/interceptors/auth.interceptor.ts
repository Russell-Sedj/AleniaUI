import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Vérifier si on est côté client avant d'accéder à localStorage
  if (isPlatformBrowser(platformId)) {
    // Chercher le token pour les deux types d'utilisateurs
    const tokenEtablissement = localStorage.getItem('authToken_etablissement');
    const tokenInterimaire = localStorage.getItem('authToken_interimaire');
    let token = tokenEtablissement || tokenInterimaire;
    
    console.log('=== Auth Interceptor ===');
    console.log('URL:', req.url);
    console.log('Token établissement:', tokenEtablissement ? 'PRÉSENT' : 'ABSENT');
    console.log('Token intérimaire:', tokenInterimaire ? 'PRÉSENT' : 'ABSENT');
    console.log('Token sélectionné:', token ? 'PRÉSENT' : 'ABSENT');
    
    // Log des autres données utiles
    console.log('UserType établissement:', localStorage.getItem('userType_etablissement'));
    console.log('UserType intérimaire:', localStorage.getItem('userType_interimaire'));
    console.log('CurrentUser établissement:', localStorage.getItem('currentUser_etablissement'));
    console.log('CurrentUser intérimaire:', localStorage.getItem('currentUser_interimaire'));
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Authorization header ajouté avec token');
    } else {
      console.log('❌ Aucun token trouvé - requête sans authentification');
    }
    console.log('========================');
  }
  
  return next(req);
};