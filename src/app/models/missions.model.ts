export interface Etablissement {
  id: string;
  name: string;
}

export interface Mission {
  id: string;
  name: string;
  status: string;
  etablissementId: string;
  etablissement?: Etablissement; // Facultatif
}