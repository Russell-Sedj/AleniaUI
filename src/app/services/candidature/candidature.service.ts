import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface CandidatureDto {
  id: string;
  missionId: string;
  missionPoste: string;
  missionEtablissement: string;
  interimaireId: string;
  interimaireNom: string;
  interimairePrenom: string;
  statut: string;
  dateCandidature: Date;
  horairesChoisis: string[];
}

export interface CreateCandidatureDto {
  missionId: string;
  interimaireId: string;
  horairesChoisis: string[];
}

export interface UpdateCandidatureStatutDto {
  statut: string; // "En cours", "Acceptée", "Refusée"
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private readonly API_URL = 'https://localhost:7134/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCandidaturesByInterimaire(interimaireId: string): Observable<CandidatureDto[]> {
    return this.http.get<CandidatureDto[]>(`${this.API_URL}/candidatures/interimaire/${interimaireId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCandidaturesByMission(missionId: string): Observable<CandidatureDto[]> {
    return this.http.get<CandidatureDto[]>(`${this.API_URL}/candidatures/mission/${missionId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCandidatureById(id: string): Observable<CandidatureDto> {
    return this.http.get<CandidatureDto>(`${this.API_URL}/candidatures/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createCandidature(candidature: CreateCandidatureDto): Observable<CandidatureDto> {
    return this.http.post<CandidatureDto>(`${this.API_URL}/candidatures`, candidature, {
      headers: this.getAuthHeaders()
    });
  }

  updateCandidatureStatut(id: string, statut: UpdateCandidatureStatutDto): Observable<CandidatureDto> {
    return this.http.put<CandidatureDto>(`${this.API_URL}/candidatures/${id}/statut`, statut, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCandidature(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/candidatures/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  checkCandidatureExists(missionId: string, interimaireId: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.API_URL}/candidatures/exists?missionId=${missionId}&interimaireId=${interimaireId}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
