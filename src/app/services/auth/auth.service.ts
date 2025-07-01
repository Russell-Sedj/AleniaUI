import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginDto {
  email: string;
  motDePasse: string;
}

export interface RegisterDto {
  email: string;
  motDePasse: string;
  confirmMotDePasse: string;
  nom: string;
  prenom: string;
  adresse?: string;
  telephone?: string;
  competences?: string[];
  disponibilites?: string;
}

export interface CreateInterimaireDto {
  Email: string;
  MotDePasse: string;
  ConfirmMotDePasse: string;
  Nom: string;
  Prenom: string;
  Adresse?: string;
  Telephone?: string;
  Competences?: string[];
  Disponibilites?: string;
}

export interface RegisterEtablissementDto {
  email: string;
  motDePasse: string;
  confirmMotDePasse: string;
  nom: string;
  responsable: string;
  adresse: string;
  telephone?: string;
  typeEtablissement?: string;
  numeroSiret?: string;
  description?: string;
}

export interface CreateEtablissementDto {
  Email: string;
  MotDePasse: string;
  ConfirmMotDePasse: string;
  Nom: string;
  Responsable: string;
  Adresse: string;
  Telephone?: string;
  TypeEtablissement?: string;
  NumeroSiret?: string;
  Description?: string;
}

export interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  dateCreation: Date;
}

export interface EtablissementUser extends User {
  nom: string;
  responsable: string;
  adresse: string;
  telephone?: string;
  typeEtablissement?: string;
  numeroSiret?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7134/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Différer l'initialisation pour éviter les dépendances circulaires
    this.initializeUser();
  }

  private initializeUser(): void {
    // Charger l'utilisateur depuis le localStorage au démarrage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && savedUser !== 'undefined' && savedUser.trim() !== '') {
        try {
          const user = JSON.parse(savedUser);
          // Transformer les propriétés PascalCase en camelCase si nécessaire
          const normalizedUser = {
            ...user,
            id: user.Id || user.id // Support pour les deux formats
          };
          this.currentUserSubject.next(normalizedUser);
        } catch (error) {
          console.warn('Erreur lors du parsing du user sauvegardé:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(credentials: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Sauvegarder l'utilisateur et le token
          if (typeof window !== 'undefined') {
            const user = response.user;
            if (user) {
              // Transformer les propriétés PascalCase en camelCase si nécessaire
              const normalizedUser = {
                ...user,
                id: user.Id || user.id // Support pour les deux formats
              };
              localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
              localStorage.setItem('authToken', response.token);
              this.currentUserSubject.next(normalizedUser);
            } else {
              console.error('Aucun utilisateur dans la réponse:', response);
            }
          }
        })
      );
  }  register(userData: RegisterDto): Observable<User> {
    // Convertir les données du format camelCase vers PascalCase pour l'API .NET
    const createInterimaireDto: any = {
      Email: userData.email,
      MotDePasse: userData.motDePasse,
      ConfirmMotDePasse: userData.confirmMotDePasse,
      Nom: userData.nom,
      Prenom: userData.prenom
    };
    
    // N'ajouter les champs optionnels que s'ils ont une valeur non vide
    if (userData.adresse && userData.adresse.trim().length > 0) {
      createInterimaireDto.Adresse = userData.adresse.trim();
    }
    
    if (userData.telephone && userData.telephone.trim().length > 0) {
      createInterimaireDto.Telephone = userData.telephone.trim();
    }
    
    if (userData.competences && Array.isArray(userData.competences) && userData.competences.length > 0) {
      createInterimaireDto.Competences = userData.competences;
    }
    
    if (userData.disponibilites && userData.disponibilites.trim().length > 0) {
      createInterimaireDto.Disponibilites = userData.disponibilites.trim();
    }
    
    console.log('Données envoyées à l\'API pour l\'inscription:', createInterimaireDto);
    return this.http.post<User>(`${this.API_URL}/auth/register`, createInterimaireDto);
  }

  loginEtablissement(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<any>(`${this.API_URL}/auth/login-etablissement`, credentials)
      .pipe(
        tap(response => {
          // Sauvegarder l'utilisateur et le token
          if (typeof window !== 'undefined') {
            // L'API retourne 'etablissement' au lieu de 'user' pour les établissements
            const user = (response as any).etablissement || (response as any).user;
            if (user) {
              // Transformer les propriétés PascalCase en camelCase si nécessaire
              const normalizedUser = {
                ...user,
                id: user.Id || user.id // Support pour les deux formats
              };
              localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('userType', 'etablissement');
              this.currentUserSubject.next(normalizedUser);
            } else {
              console.error('Aucun utilisateur dans la réponse:', response);
            }
          }
        })
      );
  }

  registerEtablissement(userData: RegisterEtablissementDto): Observable<EtablissementUser> {
    // Convertir les données du format camelCase vers PascalCase pour l'API .NET
    const createEtablissementDto: CreateEtablissementDto = {
      Email: userData.email,
      MotDePasse: userData.motDePasse,
      ConfirmMotDePasse: userData.confirmMotDePasse,
      Nom: userData.nom,
      Responsable: userData.responsable,
      Adresse: userData.adresse
    };
    
    // N'ajouter les champs optionnels que s'ils ont une valeur non vide
    if (userData.telephone && userData.telephone.trim().length > 0) {
      createEtablissementDto.Telephone = userData.telephone.trim();
    }
    
    if (userData.typeEtablissement && userData.typeEtablissement.trim().length > 0) {
      createEtablissementDto.TypeEtablissement = userData.typeEtablissement.trim();
    }

    if (userData.numeroSiret && userData.numeroSiret.trim().length > 0) {
      createEtablissementDto.NumeroSiret = userData.numeroSiret.trim();
    }

    if (userData.description && userData.description.trim().length > 0) {
      createEtablissementDto.Description = userData.description.trim();
    }
    
    console.log('Données envoyées à l\'API pour l\'inscription établissement:', createEtablissementDto);
    return this.http.post<EtablissementUser>(`${this.API_URL}/auth/register-etablissement`, createEtablissementDto);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserType(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userType');
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.API_URL}/auth/check-email/${email}`);
  }

  changePassword(passwordData: { ancienMotDePasse: string; nouveauMotDePasse: string; confirmNouveauMotDePasse: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/auth/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  getCurrentEtablissement(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.API_URL}/etablissement/current`, { headers });
  }

  updateEtablissement(data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Aucun token trouvé'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.API_URL}/etablissement/update`, data, { headers });
  }

  // Méthode de debug pour vérifier l'état de l'authentification
  debugAuthState(): void {
    console.log('=== DEBUG AUTH STATE ===');
    console.log('Current user from subject:', this.currentUserSubject.value);
    if (typeof window !== 'undefined') {
      console.log('localStorage currentUser:', localStorage.getItem('currentUser'));
      console.log('localStorage authToken:', localStorage.getItem('authToken'));
      console.log('localStorage userType:', localStorage.getItem('userType'));
    }
    console.log('========================');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }
}