import { Routes } from '@angular/router';
import { CeQueLonProposeComponent } from './pages/ce-que-lon-propose/ce-que-lon-propose.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { ContratComponent } from './pages/contrat/contrat.component';
import { DisponibiliteComponent } from './pages/disponibilite/disponibilite.component';
import { FichePosteComponent } from './pages/fiche-poste/fiche-poste.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { MissionDetailHilguegueComponent } from './pages/mission-detail/mission-detail-hilguegue.component';
import { MissionsComponent } from './pages/missions/missions.component';
import { MissionsPassesComponent } from './pages/missions-passes/missions-passes.component';
import { MissionsVenirComponent } from './pages/missions-venir/missions-venir.component';
import { Offres1Component } from './pages/offres-etablissements/offres1.component';
import { Offres2Component } from './pages/offres-interimaires/offres2.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ParametreEntrepriseComponent } from './pages/parametre-entreprise/parametre-entreprise.component';
import { PlanningEntrepriseComponent } from './pages/planning-entreprise/planning-entreprise.component';
import { PrestationComponent } from './pages/prestation/prestation.component';
import { Profil1Component } from './pages/profil1/profil1.component';
import { Profil2Component } from './pages/profil2/profil2.component';
import { Profil3Component } from './pages/profil3/profil3.component';
import { QuestionsFrequentesComponent } from './pages/questions-frequentes/questions-frequentes.component';
import { QuiSommesNousComponent } from './pages/qui-sommes-nous/qui-sommes-nous.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DeclarationAccessibiliteComponent } from './pages/declaration-accessibilite/declaration-accessibilite.component';
import { PlanDuSiteComponent } from './pages/plan-du-site/plan-du-site.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

import { DashboardInterimaireComponent } from './pages/dashboard-interimaire/dashboard-interimaire.component';

export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'ce-que-lon-propose', component: CeQueLonProposeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'contrat', component: ContratComponent },
  { path: 'disponibilite', component: DisponibiliteComponent },
  { path: 'fiche-poste', component: FichePosteComponent },
  {
    path: 'mission-detail-hilguegue',
    component: MissionDetailHilguegueComponent,
  },
  {
    path: 'mission-detail/:id',
    component: MissionDetailHilguegueComponent,
  },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'missions', component: MissionsComponent },
  { path: 'missions-passes', component: MissionsPassesComponent },
  { path: 'missions-venir', component: MissionsVenirComponent },
  { path: 'offres-etablissements', component: Offres1Component },
  { path: 'offres-interimaires', component: Offres2Component },
  { path: 'accueil', component: AccueilComponent },
  { path: 'page-accueil', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'parametre-entreprise', component: ParametreEntrepriseComponent },
  { path: 'planning-entreprise', component: PlanningEntrepriseComponent },
  { path: 'prestation', component: PrestationComponent },
  { path: 'profil1', component: Profil1Component },
  { path: 'profil2', component: Profil2Component },
  { path: 'profil3', component: Profil3Component },  { path: 'questions-frequentes', component: QuestionsFrequentesComponent },  { path: 'qui-sommes-nous', component: QuiSommesNousComponent },
  { path: 'declaration-accessibilite', component: DeclarationAccessibiliteComponent },
  { path: 'plan-du-site', component: PlanDuSiteComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
  { path: 'dashboard-interimaire', component: DashboardInterimaireComponent },
];