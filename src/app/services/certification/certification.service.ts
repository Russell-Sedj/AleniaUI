import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certification } from '../../models/certification.model';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  private apiUrl = 'https://localhost:7134/api/Certification';

  constructor(private http: HttpClient) {}

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(this.apiUrl);
  }

  getCertification(id: string): Observable<Certification> {
    return this.http.get<Certification>(`${this.apiUrl}/${id}`);
  }

  addCertification(certification: Certification): Observable<Certification> {
    return this.http.post<Certification>(this.apiUrl, certification);
  }

  updateCertification(certification: Certification): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${certification.id}`,
      certification
    );
  }

  deleteCertification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
