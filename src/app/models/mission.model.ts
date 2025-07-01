import { Candidature } from './candidature.model';

export interface Mission {
  id: string;
  etablissementId: string;
  etablissementNom?: string;
  poste: string;
  adresse: string;
  description?: string;
  tauxHoraire: number;
  datePublication: Date;
  nombreCandidatures?: number;
  
  // Champs de planification
  dateMission?: Date;
  heureDebut?: string; // Format HH:mm
  heureFin?: string;   // Format HH:mm
  dureeHeures?: number;
  estPlanifiee?: boolean;
  
  candidatures?: Candidature[];
}

export interface CreateMissionDto {
  etablissementId: string;
  poste: string;
  adresse: string;
  description?: string;
  tauxHoraire: number;
  
  // Champs de planification optionnels
  dateMission?: Date;
  heureDebut?: string;
  heureFin?: string;
  dureeHeures?: number;
}

export interface UpdateMissionDto {
  poste?: string;
  adresse?: string;
  description?: string;
  tauxHoraire?: number;
  
  // Champs de planification pour les mises à jour
  dateMission?: Date;
  heureDebut?: string;
  heureFin?: string;
  dureeHeures?: number;
  estPlanifiee?: boolean;
}
