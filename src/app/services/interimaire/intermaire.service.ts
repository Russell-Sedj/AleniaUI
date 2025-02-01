import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interimaire } from '../../models/interimaire.model';

@Injectable({
  providedIn: 'root',
})
export class InterimaireService {
  private apiUrl = 'https://localhost:7134/api/Interimaire';

  constructor(private http: HttpClient) {}

  getInterimaires(): Observable<Interimaire[]> {
    return this.http.get<Interimaire[]>(this.apiUrl);
  }

  getInterimaire(id: string): Observable<Interimaire> {
    return this.http.get<Interimaire>(`${this.apiUrl}/${id}`);
  }

  addInterimaire(interimaire: Interimaire): Observable<Interimaire> {
    return this.http.post<Interimaire>(this.apiUrl, interimaire);
  }

  updateInterimaire(interimaire: Interimaire): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${interimaire.id}`, interimaire);
  }

  deleteInterimaire(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
