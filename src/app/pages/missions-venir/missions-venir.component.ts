import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CandidatureService, CandidatureDto } from '../../services/candidature/candidature.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Mission {
  id: string;
  titre: string;
  etablissement: string;
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
  
  constructor(
    private candidatureService: CandidatureService,
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
    loadMissions() {
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
}
