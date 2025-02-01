import { Candidature } from './candidature.model';

export interface Mission {
  id: string;
  etablissementId: string;
  adresse: string;
  description?: string;
  horaires?: string[];
  candidatures?: Candidature[];
}
