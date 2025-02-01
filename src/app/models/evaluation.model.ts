export interface Evaluation {
  id: string;
  auteurId: string;
  cibleId: string;
  missionId?: string;
  type: string;
  note: number;
  commentaire?: string;
  date: Date;
}
