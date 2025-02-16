export interface RegisterModel {
  email: string;
  motDePass: string;
  role: string;
  pseudo?: string;
  nom?: string;
  prenom?: string;
  adresse?: string;
  telephone?: string;
  typeEtablissement?: string;
  competences?: string[];
  disponibilites?: string;
}
