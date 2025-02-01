export interface Candidature {
  id: string;
  missionId: string;
  interimaireId: string;
  statut: string;
  dateCandidature: Date;
  horairesChoisis: string[];
}
