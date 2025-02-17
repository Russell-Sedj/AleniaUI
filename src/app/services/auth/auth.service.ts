import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/auth/login.model';
import { RegisterModel } from '../../models/auth/register.model';
import { AuthResponse } from '../../models/auth/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7134/api/Auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(model: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, model).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
      })
    );
  }

  register(model: RegisterModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, model).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<AuthResponse | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
