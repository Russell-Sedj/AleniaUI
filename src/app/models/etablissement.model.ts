import { Utilisateur } from './utilisateur.model';
import { Mission } from './mission.model';

export interface Etablissement extends Utilisateur {
  nom: string;
  adresse: string;
  telephone?: string;
  typeEtablissement?: string;
  missions?: Mission[];
}
