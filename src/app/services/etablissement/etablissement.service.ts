import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etablissement } from '../../models/etablissement.model';

@Injectable({
  providedIn: 'root',
})
export class EtablissementService {
  private apiUrl = 'https://localhost:7134/api/Etablissement';

  constructor(private http: HttpClient) {}

  getEtablissements(): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(this.apiUrl);
  }

  getEtablissement(id: string): Observable<Etablissement> {
    return this.http.get<Etablissement>(`${this.apiUrl}/${id}`);
  }

  addEtablissement(etablissement: Etablissement): Observable<Etablissement> {
    return this.http.post<Etablissement>(this.apiUrl, etablissement);
  }

  updateEtablissement(etablissement: Etablissement): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${etablissement.id}`,
      etablissement
    );
  }

  deleteEtablissement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
