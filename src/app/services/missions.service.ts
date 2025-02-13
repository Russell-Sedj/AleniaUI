import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mission } from '../models/missions.model';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  private apiUrl = 'https://localhost:7134/api/Missions';

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.apiUrl);
  }

  getMissionById(id: string): Observable<Mission> {
    return this.http.get<Mission>(`${this.apiUrl}/${id}`);
  }

  addMission(mission: Mission): Observable<Mission> {
    return this.http.post<Mission>(this.apiUrl, mission);
  }

  updateMission(mission: Mission): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${mission.id}`, mission);
  }

  deleteMission(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
