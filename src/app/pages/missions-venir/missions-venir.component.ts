import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CandidatureService, CandidatureDto } from '../../services/candidature/candidature.service';
import { MissionService, MissionDto } from '../../services/mission/mission.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Mission {
  id: string;
  titre: string;
  etablissement: string;
  etablissementEmail?: string;
  etablissementTelephone?: string;
  dateDebut: Date;
  dateFin: Date;
  heureDebut: string;
  heureFin: string;
  tarif: number;
  lieu: string;
  statut: string;
}

@Component({
  selector: 'app-missions-venir',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './missions-venir.component.html',
  styleUrls: [],
})
export class MissionsVenirComponent implements OnInit, OnDestroy {
  candidatures: CandidatureDto[] = [];
  upcomingMissions: Mission[] = [];
  loading = true;
  error = false;
  private routerSubscription?: Subscription;
  
  // Propriétés pour le modal de contact
  showContactModal = false;
  selectedMissionForContact: any = null;
  
  constructor(
    private candidatureService: CandidatureService,
    private missionService: MissionService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadMissions();
    
    // Recharger les missions quand on navigue vers cette page
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/missions-venir') {
          this.loadMissions();
        }
      });
  }
  
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard-interimaire']);
  }
  
  loadMissions() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = true;
      this.loading = false;
      return;
    }
    
    // D'abord essayer de récupérer les missions planifiées via le service de mission
    this.missionService.getMissionsVenir().subscribe({
      next: (missions) => {
        // Filtrer les missions planifiées et confirmées
        const missionsConfirmees = missions.filter(m => m.estPlanifiee);
        
        if (missionsConfirmees.length > 0) {
          // Convertir les MissionDto en interface Mission pour l'affichage
          this.upcomingMissions = missionsConfirmees.map(mission => ({
            id: mission.id,
            titre: mission.poste,
            etablissement: mission.etablissementNom,
            etablissementEmail: 'contact@etablissement.fr', // À améliorer avec les vraies données
            etablissementTelephone: mission.etablissementTelephone || '01 45 67 89 10',
            dateDebut: mission.dateMission || new Date(),
            dateFin: mission.dateMission || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            heureDebut: mission.heureDebut || '08:00',
            heureFin: mission.heureFin || '16:00',
            tarif: mission.tauxHoraire,
            lieu: mission.adresse,
            statut: 'confirmee'
          }));
          this.loading = false;
        } else {
          // Fallback vers les candidatures acceptées
          this.loadMissionsFromCandidatures();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des missions:', error);
        // Fallback vers les candidatures acceptées
        this.loadMissionsFromCandidatures();
      }
    });
  }

  private loadMissionsFromCandidatures() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = true;
      this.loading = false;
      return;
    }
    
    // Récupérer les candidatures acceptées pour l'utilisateur actuel
    this.candidatureService.getCandidaturesByInterimaire(user.id).subscribe({
      next: (candidatures) => {
        // Filtrer seulement les candidatures acceptées
        const candidaturesAcceptees = candidatures.filter(c => c.statut === 'Acceptée' || c.statut === 'acceptee');
        
        // Convertir les candidatures en missions pour l'affichage
        this.upcomingMissions = candidaturesAcceptees.map(candidature => ({
          id: candidature.missionId,
          titre: candidature.missionPoste || 'Mission',
          etablissement: candidature.missionEtablissement || 'Établissement',
          etablissementEmail: 'contact@etablissement.fr',
          etablissementTelephone: '01 45 67 89 10',
          dateDebut: new Date(),
          dateFin: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 jours plus tard
          heureDebut: '08:00',
          heureFin: '16:00',
          tarif: 25,
          lieu: 'À définir',
          statut: 'acceptee'
        }));
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidatures:', error);
        
        // En cas d'erreur, afficher les données d'exemple pour la démo
        this.upcomingMissions = [
          {
            id: '1',
            titre: 'Infirmier en cardiologie',
            etablissement: 'Hôpital Saint-Louis',
            etablissementEmail: 'contact@hopital-saint-louis.fr',
            etablissementTelephone: '01 42 49 49 49',
            dateDebut: new Date('2025-07-01'),
            dateFin: new Date('2025-07-15'),
            heureDebut: '08:00',
            heureFin: '16:00',
            tarif: 30,
            lieu: 'Paris 10ème',
            statut: 'acceptee'
          },
          {
            id: '2',
            titre: 'Aide-soignant - Urgences',
            etablissement: 'Clinique des Lilas',
            etablissementEmail: 'contact@clinique-lilas.fr',
            etablissementTelephone: '01 48 97 05 20',
            dateDebut: new Date('2025-07-05'),
            dateFin: new Date('2025-07-12'),
            heureDebut: '14:00',
            heureFin: '22:00',
            tarif: 22,
            lieu: 'Paris 19ème',
            statut: 'acceptee'
          }
        ];
        
        this.loading = false;
      }
    });
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // ===== MÉTHODES POUR DÉTAIL ET CONTACT =====
  
  // Ouvrir le détail d'une mission
  ouvrirDetailMission(missionId: string) {
    console.log('Ouverture du détail de mission:', missionId);
    this.router.navigate(['/mission-detail', missionId]);
  }

  // Ouvrir le modal de contact établissement
  ouvrirContactEtablissement(mission?: Mission) {
    console.log('Ouverture contact établissement pour mission:', mission);
    
    // Utiliser les données de la mission si disponibles, sinon utiliser des données par défaut
    this.selectedMissionForContact = {
      etablissement: mission?.etablissement || 'Hôpital Saint-Louis',
      poste: mission?.titre || 'Infirmier en cardiologie',
      etablissementEmail: mission?.etablissementEmail || 'contact@etablissement.fr',
      etablissementTelephone: mission?.etablissementTelephone || '01 42 49 49 49'
    };
    this.showContactModal = true;
  }

  // Fermer le modal de contact
  fermerContactModal() {
    this.showContactModal = false;
    this.selectedMissionForContact = null;
  }
}
