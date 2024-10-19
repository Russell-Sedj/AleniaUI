import { Routes } from '@angular/router';
import { CeQueLonProposeComponent } from './ce-que-lon-propose/ce-que-lon-propose.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { ContratComponent } from './contrat/contrat.component';
import { DisponibiliteComponent } from './disponibilite/disponibilite.component';
import { FichePosteComponent } from './fiche-poste/fiche-poste.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { MissionDetailHilguegueComponent } from './mission-detail-hilguegue/mission-detail-hilguegue.component';
import { MissionsComponent } from './missions/missions.component';
import { MissionsPassesComponent } from './missions-passes/missions-passes.component';
import { MissionsVenirComponent } from './missions-venir/missions-venir.component';
import { Offres1Component } from './offres1/offres1.component';
import { Offres2Component } from './offres2/offres2.component';
import { PageAccueilComponent } from './page-accueil/page-accueil.component';
import { ParametreEntrepriseComponent } from './parametre-entreprise/parametre-entreprise.component';
import { PlanningEntrepriseComponent } from './planning-entreprise/planning-entreprise.component';
import { PrestationComponent } from './prestation/prestation.component';
import { Profil1Component } from './profil1/profil1.component';
import { Profil2Component } from './profil2/profil2.component';
import { Profil3Component } from './profil3/profil3.component';
import { QuestionsFrequentesComponent } from './questions-frequentes/questions-frequentes.component';
import { QuiSommesNousComponent } from './qui-sommes-nous/qui-sommes-nous.component';

export const routes: Routes = [
  { path: '', redirectTo: '/page-accueil', pathMatch: 'full' },
  { path: 'ce-que-lon-propose', component: CeQueLonProposeComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'contrat', component: ContratComponent },
  { path: 'disponibilite', component: DisponibiliteComponent },
  { path: 'fiche-poste', component: FichePosteComponent },
  {
    path: 'mission-detail-hilguegue',
    component: MissionDetailHilguegueComponent,
  },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'missions', component: MissionsComponent },
  { path: 'missions-passes', component: MissionsPassesComponent },
  { path: 'missions-venir', component: MissionsVenirComponent },
  { path: 'offres1', component: Offres1Component },
  { path: 'offres2', component: Offres2Component },
  { path: 'page-accueil', component: PageAccueilComponent },
  { path: 'parametre-entreprise', component: ParametreEntrepriseComponent },
  { path: 'planning-entreprise', component: PlanningEntrepriseComponent },
  { path: 'prestation', component: PrestationComponent },
  { path: 'profil1', component: Profil1Component },
  { path: 'profil2', component: Profil2Component },
  { path: 'profil3', component: Profil3Component },
  { path: 'questions-frequentes', component: QuestionsFrequentesComponent },
  { path: 'qui-sommes-nous', component: QuiSommesNousComponent },
];
