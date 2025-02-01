import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../../models/evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = 'https://localhost:7134/api/Evaluation';

  constructor(private http: HttpClient) {}

  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  getEvaluation(id: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`);
  }

  addEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  updateEvaluation(evaluation: Evaluation): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${evaluation.id}`, evaluation);
  }

  deleteEvaluation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
