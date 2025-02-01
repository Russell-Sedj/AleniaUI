import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidature } from '../../models/candidature.model';

@Injectable({
  providedIn: 'root',
})
export class CandidatureService {
  private apiUrl = 'https://localhost:7134/api/Candidature';

  constructor(private http: HttpClient) {}

  getCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(this.apiUrl);
  }

  getCandidature(id: string): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.apiUrl}/${id}`);
  }

  addCandidature(candidature: Candidature): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, candidature);
  }

  updateCandidature(candidature: Candidature): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${candidature.id}`, candidature);
  }

  deleteCandidature(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
