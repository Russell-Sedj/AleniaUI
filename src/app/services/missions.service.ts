import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Missions } from '../../models/missions.model';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  private apiUrl = 'https://localhost:7134/api/Missions';

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Missions[]> {
    return this.http.get<Missions[]>(this.apiUrl);
  }

  getMission(id: string): Observable<Missions> {
    return this.http.get<Missions>(`${this.apiUrl}/${id}`);
  }

  addMission(mission: Missions): Observable<Missions> {
    return this.http.post<Missions>(this.apiUrl, mission);
  }

  updateMission(mission: Missions): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${mission.id}`, mission);
  }

  deleteMission(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
