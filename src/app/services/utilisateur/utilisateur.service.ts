import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = 'https://localhost:7134/api/Utilisateur';

  constructor(private http: HttpClient) {}

  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getUtilisateur(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }

  updateUtilisateur(utilisateur: Utilisateur): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${utilisateur.id}`, utilisateur);
  }

  deleteUtilisateur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
