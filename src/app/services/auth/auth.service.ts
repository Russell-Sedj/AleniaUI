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
  
  // Indicateur pour éviter les initialisations multiples
  private isInitialized = false;
  
  // Type d'utilisateur actuel fixé pour cette session
  private currentSessionType: 'interimaire' | 'etablissement' | null = null;

  constructor(private http: HttpClient) {
    // Ne pas initialiser automatiquement au démarrage
    // L'initialisation se fera lors du premier appel à un dashboard spécifique
  }

  // Méthode pour initialiser explicitement le contexte utilisateur
  initializeUserContext(userType: 'interimaire' | 'etablissement'): void {
    if (this.isInitialized && this.currentSessionType === userType) {
      return; // Déjà initialisé pour ce type
    }

    console.log(`🔐 Initialisation du contexte ${userType}`);
    this.currentSessionType = userType;
    this.isInitialized = true;

    if (typeof window !== 'undefined') {
      // Nettoyer d'abord le state actuel
      this.currentUserSubject.next(null);
      
      // Charger uniquement l'utilisateur du type spécifié
      const savedUser = this.getStorageItem('currentUser', userType);
      const savedToken = this.getStorageItem('authToken', userType);
      
      if (savedUser && savedToken && savedUser !== 'undefined' && savedUser.trim() !== '') {
        try {
          const user = JSON.parse(savedUser);
          
          // Vérifier que le token n'est pas expiré
          if (this.isTokenExpired(savedToken)) {
            console.warn(`⚠️ Token expiré pour ${userType}, nettoyage de la session`);
            this.clearUserSession(userType);
            return;
          }
          
          // Transformer les propriétés PascalCase en camelCase si nécessaire
          const normalizedUser = {
            ...user,
            id: user.Id || user.id // Support pour les deux formats
          };
          
          console.log(`✅ Utilisateur ${userType} chargé:`, normalizedUser.email);
          this.currentUserSubject.next(normalizedUser);
        } catch (error) {
          console.warn(`❌ Erreur lors du parsing du user ${userType}:`, error);
          this.clearUserSession(userType);
        }
      } else {
        console.log(`ℹ️ Aucune session ${userType} trouvée`);
      }
    }
  }

  // Méthode pour nettoyer une session spécifique
  private clearUserSession(userType: 'interimaire' | 'etablissement'): void {
    this.removeStorageItem('currentUser', userType);
    this.removeStorageItem('authToken', userType);
    this.removeStorageItem('userType', userType);
  }

  // Méthodes pour gérer les clés de stockage avec un type obligatoire
  private getStorageKey(baseKey: string, userType: 'interimaire' | 'etablissement'): string {
    return `${baseKey}_${userType}`;
  }

  private setStorageItem(key: string, value: string, userType: 'interimaire' | 'etablissement'): void {
    if (typeof window !== 'undefined') {
      const storageKey = this.getStorageKey(key, userType);
      localStorage.setItem(storageKey, value);
    }
  }

  private getStorageItem(key: string, userType: 'interimaire' | 'etablissement'): string | null {
    if (typeof window !== 'undefined') {
      const storageKey = this.getStorageKey(key, userType);
      return localStorage.getItem(storageKey);
    }
    return null;
  }

  private removeStorageItem(key: string, userType: 'interimaire' | 'etablissement'): void {
    if (typeof window !== 'undefined') {
      const storageKey = this.getStorageKey(key, userType);
      localStorage.removeItem(storageKey);
    }
  }

  async loginWithConflictCheck(credentials: LoginDto): Promise<Observable<any>> {
    // Vérifier s'il y a un conflit de session
    if (this.detectSessionConflict('interimaire')) {
      const canProceed = await this.handleSessionConflict('interimaire');
      if (!canProceed) {
        throw new Error('Connexion annulée par l\'utilisateur');
      }
    }
    
    return this.login(credentials);
  }

  async loginEtablissementWithConflictCheck(credentials: LoginDto): Promise<Observable<AuthResponse>> {
    // Vérifier s'il y a un conflit de session
    if (this.detectSessionConflict('etablissement')) {
      const canProceed = await this.handleSessionConflict('etablissement');
      if (!canProceed) {
        throw new Error('Connexion annulée par l\'utilisateur');
      }
    }
    
    return this.loginEtablissement(credentials);
  }

  login(credentials: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Sauvegarder l'utilisateur et le token pour intérimaires
          if (typeof window !== 'undefined') {
            const user = response.user;
            if (user) {
              // Transformer les propriétés PascalCase en camelCase si nécessaire
              const normalizedUser = {
                ...user,
                id: user.Id || user.id // Support pour les deux formats
              };
              
              console.log('🔐 Connexion intérimaire réussie:', normalizedUser.email);
              
              // Nettoyer toute session établissement existante
              this.clearUserSession('etablissement');
              
              // Sauvegarder la nouvelle session intérimaire
              this.setStorageItem('currentUser', JSON.stringify(normalizedUser), 'interimaire');
              this.setStorageItem('authToken', response.token, 'interimaire');
              this.setStorageItem('userType', 'interimaire', 'interimaire');
              
              // Fixer le type de session et mettre à jour le subject
              this.currentSessionType = 'interimaire';
              this.isInitialized = true;
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
          // Sauvegarder l'utilisateur et le token pour établissements
          if (typeof window !== 'undefined') {
            // L'API retourne 'etablissement' au lieu de 'user' pour les établissements
            const user = (response as any).etablissement || (response as any).user;
            if (user) {
              // Transformer les propriétés PascalCase en camelCase si nécessaire
              const normalizedUser = {
                ...user,
                id: user.Id || user.id // Support pour les deux formats
              };
              
              console.log('🔐 Connexion établissement réussie:', normalizedUser.email);
              
              // Nettoyer toute session intérimaire existante
              this.clearUserSession('interimaire');
              
              // Sauvegarder la nouvelle session établissement
              this.setStorageItem('currentUser', JSON.stringify(normalizedUser), 'etablissement');
              this.setStorageItem('authToken', response.token, 'etablissement');
              this.setStorageItem('userType', 'etablissement', 'etablissement');
              
              // Fixer le type de session et mettre à jour le subject
              this.currentSessionType = 'etablissement';
              this.isInitialized = true;
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
    console.log('🚪 Logout - nettoyage de toutes les sessions');
    
    if (typeof window !== 'undefined') {
      // Nettoyer toutes les sessions possibles
      this.clearUserSession('interimaire');
      this.clearUserSession('etablissement');
      
      // Nettoyer aussi les anciennes clés (compatibilité)
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
    }
    
    // Réinitialiser l'état interne
    this.currentSessionType = null;
    this.isInitialized = false;
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Vérifier selon le type de session actuel
    if (this.currentSessionType) {
      const token = this.getStorageItem('authToken', this.currentSessionType);
      return !!token && !this.isTokenExpired(token);
    }
    
    return false;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Retourner le token du type de session actuel uniquement
    if (this.currentSessionType) {
      return this.getStorageItem('authToken', this.currentSessionType);
    }
    
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserType(): string | null {
    return this.currentSessionType;
  }

  // Méthode pour vérifier si l'utilisateur actuel correspond au type attendu
  isUserType(expectedType: 'interimaire' | 'etablissement'): boolean {
    return this.currentSessionType === expectedType && this.isAuthenticated();
  }

  // Méthode pour forcer la réinitialisation de la session
  resetSession(): void {
    console.log('🔄 Réinitialisation forcée de la session');
    this.currentSessionType = null;
    this.isInitialized = false;
    this.currentUserSubject.next(null);
  }

  // Méthode pour détecter un conflit de session
  detectSessionConflict(newUserType: 'interimaire' | 'etablissement'): boolean {
    if (!this.isInitialized || !this.currentSessionType) {
      return false; // Pas de conflit si aucune session active
    }
    
    // Il y a conflit si on essaie de connecter un type différent
    return this.currentSessionType !== newUserType;
  }

  // Méthode pour gérer les conflits de session
  handleSessionConflict(newUserType: 'interimaire' | 'etablissement'): Promise<boolean> {
    return new Promise((resolve) => {
      const currentType = this.currentSessionType;
      const currentUser = this.getCurrentUser();
      
      if (currentUser && currentType) {
        const typeNames = {
          'interimaire': 'intérimaire',
          'etablissement': 'établissement'
        };
        
        const message = `⚠️ Attention: vous êtes déjà connecté en tant qu'${typeNames[currentType]} (${currentUser.email}). 
        
Voulez-vous vous déconnecter et vous connecter en tant qu'${typeNames[newUserType]} ?`;
        
        if (confirm(message)) {
          console.log(`🔄 Déconnexion forcée de ${currentType} pour permettre connexion ${newUserType}`);
          this.logout();
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  }

  // Méthode pour vérifier l'intégrité de la session
  checkSessionIntegrity(expectedType: 'interimaire' | 'etablissement'): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }
    
    const currentUser = this.getCurrentUser();
    const currentType = this.getUserType();
    
    if (!currentUser || currentType !== expectedType) {
      console.warn(`⚠️ Incohérence de session détectée: attendu ${expectedType}, trouvé ${currentType}`);
      this.resetSession();
      return false;
    }
    
    return true;
  }

  // Méthode utilitaire pour afficher l'état de la session (debug)
  logSessionState(): void {
    console.log('=== ÉTAT DE LA SESSION ===');
    console.log('Type de session actuel:', this.currentSessionType);
    console.log('Initialisé:', this.isInitialized);
    console.log('Authentifié:', this.isAuthenticated());
    console.log('Utilisateur actuel:', this.getCurrentUser());
    console.log('========================');
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