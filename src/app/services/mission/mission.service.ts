import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface MissionDto {
  id: string;
  etablissementId: string;
  etablissementNom: string;
  poste: string;
  adresse: string;
  description?: string;
  tauxHoraire: number;
  horaires?: string[];
  datePublication: Date;
  nombreCandidatures: number;
}

export interface MissionDetailDto extends MissionDto {
  candidatures?: CandidatureDto[];
}

export interface CreateMissionDto {
  etablissementId: string;
  poste: string;
  adresse: string;
  description?: string;
  tauxHoraire: number;
  horaires?: string[];
}

export interface UpdateMissionDto {
  poste?: string;
  adresse?: string;
  description?: string;
  tauxHoraire?: number;
  horaires?: string[];
}

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

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private readonly API_URL = 'https://localhost:7134/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllMissions(): Observable<MissionDto[]> {
    return this.http.get<MissionDto[]>(`${this.API_URL}/missions`);
  }

  getMissionById(id: string): Observable<MissionDetailDto> {
    return this.http.get<MissionDetailDto>(`${this.API_URL}/missions/${id}`);
  }

  getMissionsByEtablissement(etablissementId: string): Observable<MissionDto[]> {
    return this.http.get<MissionDto[]>(`${this.API_URL}/missions/etablissement/${etablissementId}`);
  }

  createMission(mission: CreateMissionDto): Observable<MissionDto> {
    return this.http.post<MissionDto>(`${this.API_URL}/missions`, mission, {
      headers: this.getAuthHeaders()
    });
  }

  updateMission(id: string, mission: UpdateMissionDto): Observable<MissionDto> {
    return this.http.put<MissionDto>(`${this.API_URL}/missions/${id}`, mission, {
      headers: this.getAuthHeaders()
    });
  }

  deleteMission(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/missions/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  searchMissions(filters: {
    poste?: string;
    adresse?: string;
    tauxMin?: number;
    tauxMax?: number;
  }): Observable<MissionDto[]> {
    const params = new URLSearchParams();
    
    if (filters.poste) params.append('poste', filters.poste);
    if (filters.adresse) params.append('adresse', filters.adresse);
    if (filters.tauxMin) params.append('tauxMin', filters.tauxMin.toString());
    if (filters.tauxMax) params.append('tauxMax', filters.tauxMax.toString());

    return this.http.get<MissionDto[]>(`${this.API_URL}/missions/search?${params.toString()}`);
  }

  // Méthodes pour les données mockées (à supprimer une fois l'API connectée)
  getMissionsVenir(): Observable<MissionDto[]> {
    return this.getAllMissions(); // Pour l'instant, retourne toutes les missions
  }

  getMissionsPasses(): Observable<MissionDto[]> {
    return this.getAllMissions(); // Pour l'instant, retourne toutes les missions
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
