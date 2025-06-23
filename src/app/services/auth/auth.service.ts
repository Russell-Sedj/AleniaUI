import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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

export interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  dateCreation: Date;
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
    // Charger l'utilisateur depuis le localStorage au démarrage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Sauvegarder l'utilisateur et le token
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('authToken', response.token);
          }
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(userData: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/register`, userData);
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

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.API_URL}/auth/check-email/${email}`);
  }

  changePassword(passwordData: { ancienMotDePasse: string; nouveauMotDePasse: string; confirmNouveauMotDePasse: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/auth/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
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