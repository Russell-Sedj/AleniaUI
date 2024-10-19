import { Routes } from '@angular/router';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { PageAccueilComponent } from './page-accueil/page-accueil.component';

export const routes: Routes = [
  { path: '', redirectTo: '/page-accueil', pathMatch: 'full' },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'page-accueil', component: PageAccueilComponent },
];
