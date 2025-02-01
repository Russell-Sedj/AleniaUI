import { Utilisateur } from './utilisateur.model';

export interface Admin extends Utilisateur {
  pseudo: string;
}
