import { Utilisateur } from './utilisateur.model';
import { Certification } from './certification.model';
import { Candidature } from './candidature.model';

export interface Interimaire extends Utilisateur {
  nom: string;
  prenom: string;
  adresse?: string;
  telephone?: string;
  competences?: string[];
  disponibilites?: string;
  certifications?: Certification[];
  candidatures?: Candidature[];
}
