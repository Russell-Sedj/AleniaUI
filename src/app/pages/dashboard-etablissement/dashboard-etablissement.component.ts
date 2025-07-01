import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from '../../services/candidature/candidature.service';
import { MissionService, MissionDto } from '../../services/mission/mission.service';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { 
  SidebarEtablissementComponent,
  NavigationItemEtablissement,
  EtablissementProfile
} from '../../components/sidebar-etablissement';
import { AvatarInitialsComponent } from '../../components/avatar-initials';
import { IconComponent } from '../../components/icon';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

interface Interimaire {
  id: string;
  prenom: string;
  nom: string;
  specialite: string;
  experience: number;
  note: number;
  disponible: boolean;
  photo?: string;
  telephone: string;
  email: string;
  localisation: string;
  tarif: number;
  derniereConnexion: Date;
}

interface Mission {
  id: string;
  titre: string;
  service: string;
  specialite: string;
  dateDebut: Date;
  dateFin: Date;
  heureDebut: string;
  heureFin: string;
  tarif: number;
  statut: 'brouillon' | 'publiee' | 'pourvue' | 'terminee' | 'annulee';
  candidatures: number;
  urgente: boolean;
  description: string;
  competencesRequises: string[];
  interimaire?: Interimaire;
  
  // Champs de planification
  dateMission?: Date;
  dureeHeures?: number;
  estPlanifiee?: boolean;
}

interface Candidature {
  id: string;
  missionId: string;
  interimaire: Interimaire;
  mission: Mission;
  dateCandidature: Date;
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'retiree';
  message?: string;
  tarifPropose?: number;
}

interface Statistiques {
  missionsPubliees: number;
  missionsPourvues: number;
  candidaturesRecues: number;
  tauxPourvoi: number;
  interimairesActifs: number;
  noteMoyenne: number;
  economiesRealisees: number;
  tempsGagne: number;
}

interface PlanningMission {
  id: string;
  mission: Mission;
  date: Date;
  heureDebut: string;
  heureFin: string;
  interimaire?: Interimaire;
  statut: 'planifiee' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';
  couleur?: string;
}

interface JourCalendrier {
  date: Date;
  missions: PlanningMission[];
  estAujourdhui: boolean;
  estDansLeMois: boolean;
}

interface Facture {
  id: string;
  numero: string;
  dateEmission: Date;
  dateEcheance: Date;
  periode: {
    debut: Date;
    fin: Date;
  };
  missions: FactureMission[];
  montantHT: number;
  tva: number;
  montantTTC: number;
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard' | 'annulee';
  datePaiement?: Date;
  notes?: string;
}

interface FactureMission {
  mission: Mission;
  interimaire: Interimaire;
  heuresTravaillees: number;
  tarifHoraire: number;
  montant: number;
  periode: string;
}

interface PaiementStatistiques {
  totalFacture: number;
  totalPaye: number;
  totalEnAttente: number;
  totalEnRetard: number;
  nombreFactures: number;
  delaiMoyenPaiement: number;
}

interface StatistiquesDetaillees {
  // Statistiques missions
  missionsParMois: { mois: string; nombre: number }[];
  missionsParService: { service: string; nombre: number; pourcentage: number }[];
  missionsParSpecialite: { specialite: string; nombre: number; dureemoyenne: number }[];
  
  // Statistiques intérimaires
  interimairesParSpecialite: { specialite: string; nombre: number; notemoyenne: number }[];
  evolutionInterimaires: { mois: string; actifs: number; nouveaux: number }[];
  
  // Statistiques financières
  coutsMensuels: { mois: string; montant: number; heures: number }[];
  comparaisonTarifs: { specialite: string; tarifMoyen: number; tarifMarche: number }[];
  
  // Performance
  delaisPourvoi: { mois: string; delaiMoyen: number }[];
  tauxSatisfaction: { mois: string; taux: number }[];
  economiesRealisees: { categorie: string; montant: number }[];
}

@Component({
  selector: 'app-dashboard-etablissement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, SidebarEtablissementComponent, AvatarInitialsComponent, IconComponent, NotificationComponent, ConfirmationModalComponent],
  templateUrl: './dashboard-etablissement.component.html',
  styleUrl: './dashboard-etablissement.component.css',
})
export class DashboardEtablissementComponent implements OnInit {
  
  // Navigation
  activeSection: string = 'tableau-bord';
  
  // Propriétés pour la sidebar
  navigationItems: NavigationItemEtablissement[] = [
    {
      id: 'tableau-bord',
      label: 'Tableau de bord',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>'
    },
    {
      id: 'missions',
      label: 'Mes Missions',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2"></path></svg>'
    },
    {
      id: 'interimaires',
      label: 'Intérimaires',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>'
    },
    {
      id: 'candidatures',
      label: 'Candidatures',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
    },
    {
      id: 'planning',
      label: 'Planning',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    },
    {
      id: 'gestion-financiere',
      label: 'Gestion financière',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    {
      id: 'statistiques',
      label: 'Statistiques',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>'
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
    }
  ];

  sidebarEtablissementProfile: EtablissementProfile = {
    nom: '',
    responsable: '',
    initials: 'ET'
  };

  // Données de l'établissement
  etablissement: any = {
    nom: '',
    type: '',
    adresse: '',
    telephone: '',
    email: '',
    siret: '',
    responsable: '',
    description: '',
    services: []
  };

  // Formulaires
  missionForm!: FormGroup;
  rechercheForm!: FormGroup;
  parametresForm!: FormGroup;
  
  // Données
  missions: Mission[] = [];
  interimaires: Interimaire[] = [];
  candidatures: Candidature[] = [];
  statistiques: Statistiques = {
    missionsPubliees: 0,
    missionsPourvues: 0,
    candidaturesRecues: 0,
    tauxPourvoi: 0,
    interimairesActifs: 0,
    noteMoyenne: 0,
    economiesRealisees: 0,
    tempsGagne: 0
  };

  // États UI
  showMissionModal = false;
  showCandidatureModal = false;
  selectedMission: Mission | null = null;
  selectedCandidature: Candidature | null = null;
  isEditingMission = false;
  isUpdatingParametres = false;

  // Filtres
  filtreStatut = '';
  filtreService = '';
  filtreSpecialite = '';
  rechercheText = '';


  // Planning
  currentDate = new Date();
  viewMode: 'month' | 'week' | 'day' = 'month';
  calendarDays: JourCalendrier[] = [];
  planningMissions: PlanningMission[] = [];
  selectedDate: Date | null = null;
  showPlanningModal = false;
  selectedPlanningMission: PlanningMission | null = null;

  // Facturation
  factures: Facture[] = [];
  paiementStats: PaiementStatistiques = {
    totalFacture: 0,
    totalPaye: 0,
    totalEnAttente: 0,
    totalEnRetard: 0,
    nombreFactures: 0,
    delaiMoyenPaiement: 0
  };
  showFactureModal = false;
  selectedFacture: Facture | null = null;
  filtreStatutFacture = '';
  filtrePeriode = '';

  // Statistiques détaillées
  statistiquesDetaillees: StatistiquesDetaillees = {
    missionsParMois: [],
    missionsParService: [],
    missionsParSpecialite: [],
    interimairesParSpecialite: [],
    evolutionInterimaires: [],
    coutsMensuels: [],
    comparaisonTarifs: [],
    delaisPourvoi: [],
    tauxSatisfaction: [],
    economiesRealisees: []
  };
  periodeStatistiques = 'annee'; // mois, trimestre, annee
  Math = Math; // Pour utiliser Math dans le template
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidatureService: CandidatureService,
    private missionService: MissionService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit() {
    this.initForms();
    this.initParametresForm(); // Ajoutez cette ligne si elle n'existe pas
    this.loadData();
    this.loadEtablissementData(); // Ajoutez cette ligne si elle n'existe pas
    this.updateSidebarEtablissementProfile();
  }

  // Méthode pour convertir le format time (HH:mm) en format TimeSpan .NET (HH:mm:ss)
  convertToTimeSpanFormat(timeString: string): string {
    if (!timeString) return '';
    // Si le format est HH:mm, ajouter :00 pour les secondes
    if (timeString.length === 5 && timeString.includes(':')) {
      return timeString + ':00';
    }
    return timeString;
  }

  // Méthode pour calculer automatiquement la durée à partir des heures de début et fin
  getCalculatedDuration(): number | null {
    const heureDebut = this.missionForm.get('heureDebut')?.value;
    const heureFin = this.missionForm.get('heureFin')?.value;
    
    if (!heureDebut || !heureFin) {
      return null;
    }
    
    // Convertir les heures en minutes depuis minuit
    const [debutHour, debutMin] = heureDebut.split(':').map(Number);
    const [finHour, finMin] = heureFin.split(':').map(Number);
    
    const debutMinutes = debutHour * 60 + debutMin;
    let finMinutes = finHour * 60 + finMin;
    
    // Gérer le cas où la fin est le lendemain (ex: 22:00 - 06:00)
    if (finMinutes <= debutMinutes) {
      finMinutes += 24 * 60; // Ajouter 24 heures
    }
    
    const durationMinutes = finMinutes - debutMinutes;
    const durationHours = durationMinutes / 60;
    
    // Arrondir à 0.5 heure près
    return Math.round(durationHours * 2) / 2;
  }

  // Méthode utilitaire pour obtenir la durée calculée en nombre d'heures entier
  getCalculatedDurationHours(): number {
    const duration = this.getCalculatedDuration();
    return duration ? Math.round(duration) : 0;
  }

  initForms() {
    this.missionForm = this.fb.group({
      poste: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      tauxHoraire: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      
      // Champs de planification (obligatoires)
      dateMission: ['', [Validators.required]],
      heureDebut: ['', [Validators.required]],
      heureFin: ['', [Validators.required]]
    });

    this.rechercheForm = this.fb.group({
      specialite: [''],
      experience: [''],
      localisation: [''],
      disponibilite: [''],
      note: ['']
    });
  }

  initParametresForm() {
    this.parametresForm = this.fb.group({
      nom: ['', [Validators.required]],
      type: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      siret: [''],
      responsable: ['', [Validators.required]],
      description: ['']
    });
  }

  loadData() {
    this.loadMissions(); // loadCandidatures() sera appelé depuis loadMissions()
    this.loadInterimaires();
    this.loadStatistiques();
    this.loadFacturationData();
    this.loadStatistiquesDetaillees(); // AJOUTEZ CETTE LIGNE
  }
  loadMissions() {
    this.missionService.getAllMissions().subscribe({
      next: (missions: MissionDto[]) => {
        console.log('Missions chargées depuis l\'API:', missions);
        
        // Convertir les MissionDto vers le format attendu par le template
        this.missions = missions.map(mission => ({
          id: mission.id,
          titre: mission.poste,
          service: '', // Pas disponible dans le DTO
          specialite: mission.poste,
          dateDebut: new Date(mission.datePublication),
          dateFin: new Date(mission.datePublication),
          heureDebut: mission.heureDebut || '',
          heureFin: mission.heureFin || '',
          tarif: mission.tauxHoraire,
          statut: 'publiee' as const,
          candidatures: mission.nombreCandidatures,
          urgente: false,
          description: mission.description || '',
          competencesRequises: [],
          interimaire: undefined,
          
          // *** CHAMPS DE PLANIFICATION ***
          dateMission: mission.dateMission ? new Date(mission.dateMission) : undefined,
          dureeHeures: mission.dureeHeures,
          estPlanifiee: mission.estPlanifiee || false
        }));
        
        console.log('Missions formatées:', this.missions);
        
        // Charger les données du planning après avoir chargé les missions
        this.loadPlanningData();
        
        // Charger les candidatures après avoir chargé les missions
        this.loadCandidatures();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des missions:', error);
        // En cas d'erreur, utiliser des données par défaut pour éviter un crash
        this.missions = [];
      }
    });
  }

  loadInterimaires() {
    this.interimaires = [
      {
        id: '1',
        prenom: 'Sophie',
        nom: 'Martin',
        specialite: 'Aide-soignant',
        experience: 3,
        note: 4.8,
        disponible: true,
        telephone: '06 12 34 56 78',
        email: 'sophie.martin@email.com',
        localisation: 'Paris 12ème',
        tarif: 22,
        derniereConnexion: new Date()
      },
      {
        id: '2',
        prenom: 'Jean',
        nom: 'Dupont',
        specialite: 'Infirmier(ère)',
        experience: 8,
        note: 4.9,
        disponible: true,
        telephone: '06 98 76 54 32',
        email: 'jean.dupont@email.com',
        localisation: 'Paris 11ème',
        tarif: 28,
        derniereConnexion: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];
  }  loadCandidatures() {
    // Réinitialiser la liste des candidatures
    this.candidatures = [];
    
    // Pour un POC, récupérons les candidatures de toutes les missions
    // Dans un vrai système, on filtrerait par établissement
    this.missions.forEach(mission => {
      if (mission.id) {
        this.candidatureService.getCandidaturesByMission(mission.id).subscribe({
          next: (candidatures) => {
            console.log('Candidatures reçues pour mission', mission.id, ':', candidatures);
            
            // Convertir les CandidatureDto vers le format attendu par le template
            const candidaturesFormatted: Candidature[] = candidatures.map(candidature => ({
              id: candidature.id,
              missionId: candidature.missionId,
              interimaire: {
                id: candidature.interimaireId,
                prenom: candidature.interimairePrenom,
                nom: candidature.interimaireNom,
                email: '', // Pas disponible dans le DTO
                telephone: '', // Pas disponible dans le DTO
                specialite: '', // Pas disponible dans le DTO
                experience: 0, // Pas disponible dans le DTO
                note: 4.5, // Valeur par défaut
                localisation: '', // Pas disponible dans le DTO
                disponible: true, // Valeur par défaut
                tarif: 25, // Valeur par défaut
                derniereConnexion: new Date() // Valeur par défaut
              },
              mission: {
                id: candidature.missionId,
                titre: candidature.missionPoste,
                service: '', // Pas disponible dans le DTO
                specialite: candidature.missionPoste,
                dateDebut: new Date(),
                dateFin: new Date(),
                heureDebut: '',
                heureFin: '',
                tarif: 0,
                description: '',
                statut: 'publiee' as const,
                candidatures: 0,
                urgente: false,
                competencesRequises: []
              },
              dateCandidature: new Date(candidature.dateCandidature),
              statut: this.mapStatutToTemplate(candidature.statut),
              message: '', // Pas disponible dans le DTO
              tarifPropose: 25 // Valeur par défaut
            }));
            
            // Ajouter les candidatures de cette mission à la liste globale
            this.candidatures = [...this.candidatures, ...candidaturesFormatted];
            console.log('Candidatures totales chargées:', this.candidatures);
          },
          error: (error) => {
            console.error('Erreur lors du chargement des candidatures pour la mission', mission.id, ':', error);
          }
        });
      }
    });
  }
  
  private mapStatutToTemplate(statut: string): 'en_attente' | 'acceptee' | 'refusee' | 'retiree' {
    switch (statut) {
      case 'En cours': return 'en_attente';
      case 'Acceptée': return 'acceptee';
      case 'Refusée': return 'refusee';
      default: return 'en_attente';
    }
  }

  loadStatistiques() {
    this.statistiques = {
      missionsPubliees: 24,
      missionsPourvues: 18,
      candidaturesRecues: 156,
      tauxPourvoi: 75,
      interimairesActifs: 45,
      noteMoyenne: 4.6,
      economiesRealisees: 15420,
      tempsGagne: 89
    };
  }

  // ===== MÉTHODES POUR LE PLANNING =====

  loadPlanningData() {
    // Charger les vraies missions planifiées depuis les missions existantes
    this.planningMissions = this.missions
      .filter(mission => mission.estPlanifiee && mission.dateMission)
      .map(mission => ({
        id: mission.id,
        mission: mission,
        date: new Date(mission.dateMission!),
        heureDebut: mission.heureDebut || '',
        heureFin: mission.heureFin || '',
        interimaire: mission.interimaire || undefined,
        statut: mission.interimaire ? 'confirmee' : 'planifiee',
        couleur: mission.interimaire ? '#10B981' : '#F59E0B'
      })) as PlanningMission[];
    
    console.log('Missions planifiées chargées:', this.planningMissions);
    this.generateCalendar();
  }

  generateCalendar() {
    this.calendarDays = [];
    
    if (this.viewMode === 'month') {
      this.generateMonthView();
    } else if (this.viewMode === 'week') {
      this.generateWeekView();
    } else {
      this.generateDayView();
    }
  }

  generateMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Premier jour de la semaine du calendrier (peut être le mois précédent)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Générer 42 jours (6 semaines × 7 jours)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const missions = this.getMissionsForDate(date);
      
      this.calendarDays.push({
        date: new Date(date),
        missions,
        estAujourdhui: this.isSameDay(date, new Date()),
        estDansLeMois: date.getMonth() === month
      });
    }
  }

  generateWeekView() {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const missions = this.getMissionsForDate(date);
      
      this.calendarDays.push({
        date: new Date(date),
        missions,
        estAujourdhui: this.isSameDay(date, new Date()),
        estDansLeMois: true
      });
    }
  }

  generateDayView() {
    const missions = this.getMissionsForDate(this.currentDate);
    
    this.calendarDays = [{
      date: new Date(this.currentDate),
      missions,
      estAujourdhui: this.isSameDay(this.currentDate, new Date()),
      estDansLeMois: true
    }];
  }

  getMissionsForDate(date: Date): PlanningMission[] {
    return this.planningMissions.filter(mission => 
      this.isSameDay(mission.date, date)
    );
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Navigation du calendrier
  previousPeriod() {
    if (this.viewMode === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.viewMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.generateCalendar();
  }

  nextPeriod() {
    if (this.viewMode === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.viewMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.generateCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  setViewMode(mode: 'month' | 'week' | 'day') {
    this.viewMode = mode;
    this.generateCalendar();
  }

  // Navigation
  setActiveSection(section: string) {
    this.activeSection = section;
  }

  // Méthodes pour la sidebar
  onSidebarItemClick(item: NavigationItemEtablissement) {
    this.setActiveSection(item.id);
  }

  onSidebarLogout() {
    this.logout();
  }

  // Méthode pour générer les initiales de l'établissement
  getEtablissementInitials(): string {
    const nom = this.etablissement.nom || 'ET';
    const words = nom.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return nom.substring(0, 2).toUpperCase();
  }

  // Méthode pour mettre à jour le profil de la sidebar
  updateSidebarEtablissementProfile() {
    this.sidebarEtablissementProfile = {
      nom: this.etablissement.nom,
      responsable: this.etablissement.responsable,
      initials: this.getEtablissementInitials()
    };
  }

  getSectionTitle(): string {
    const titles = {
      'tableau-bord': 'Tableau de bord',
      'missions': 'Gestion des missions',
      'interimaires': 'Base intérimaires',
      'candidatures': 'Candidatures reçues',
      'planning': 'Planning des missions',
      'gestion-financiere': 'Gestion financière', 
      'statistiques': 'Statistiques & Analyses',
      'parametres': 'Paramètres'
    };
    return titles[this.activeSection as keyof typeof titles] || 'Dashboard';
  }

  // Gestion des missions
  openMissionModal(mission?: Mission) {
    this.selectedMission = mission || null;
    this.isEditingMission = !!mission;
    
    if (mission) {
      this.missionForm.patchValue(mission);
    } else {
      this.missionForm.reset();
    }
    
    this.showMissionModal = true;
  }

  closeMissionModal() {
    this.showMissionModal = false;
    this.selectedMission = null;
    this.isEditingMission = false;
    this.missionForm.reset();
  }  saveMission() {
    if (this.missionForm.valid) {
      const formData = this.missionForm.value;
      
      // Calculer automatiquement la durée
      const calculatedDuration = this.getCalculatedDurationHours();
      
      if (this.isEditingMission && this.selectedMission) {
        // Modifier mission existante
        const updateData = {
          poste: formData.poste,
          adresse: formData.adresse,
          description: formData.description,
          tauxHoraire: formData.tauxHoraire,
          
          // Champs de planification avec durée calculée
          dateMission: formData.dateMission ? new Date(formData.dateMission) : undefined,
          heureDebut: formData.heureDebut || undefined,
          heureFin: formData.heureFin || undefined,
          dureeHeures: calculatedDuration > 0 ? calculatedDuration : undefined
        };
        
        this.missionService.updateMission(this.selectedMission.id, updateData).subscribe({
          next: (mission) => {
            console.log('Mission modifiée:', mission);
            this.notificationService.success('Mission modifiée avec succès !');
            this.closeMissionModal();
            this.loadMissions(); // Recharger les missions
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            this.notificationService.error('Erreur lors de la modification de la mission');
          }
        });
      } else {
        // Créer nouvelle mission
        // Debug de l'état d'authentification
        this.authService.debugAuthState();
        
        const currentUser = this.authService.getCurrentUser();
        console.log('Utilisateur actuel récupéré:', currentUser);
        console.log('Type d\'utilisateur:', this.authService.getUserType());
        console.log('Token présent:', !!this.authService.getToken());
        
        if (!currentUser) {
          this.notificationService.error('Erreur: Utilisateur non connecté');
          console.error('Aucun utilisateur connecté détecté');
          return;
        }
        
        if (!currentUser.id) {
          this.notificationService.error('Erreur: ID utilisateur manquant');
          console.error('Utilisateur sans ID:', currentUser);
          return;
        }

        const newMissionData = {
          etablissementId: currentUser.id, // Utiliser l'ID de l'utilisateur connecté
          poste: formData.poste,
          adresse: formData.adresse,
          description: formData.description,
          tauxHoraire: parseFloat(formData.tauxHoraire), // S'assurer que c'est un nombre
          
          // Champs de planification - convertir les heures au format TimeSpan et calculer la durée
          dateMission: formData.dateMission ? formData.dateMission : undefined,
          heureDebut: formData.heureDebut ? this.convertToTimeSpanFormat(formData.heureDebut) : undefined,
          heureFin: formData.heureFin ? this.convertToTimeSpanFormat(formData.heureFin) : undefined,
          dureeHeures: calculatedDuration > 0 ? calculatedDuration : undefined
        };
        
        console.log('Création de mission avec les données:', newMissionData);
        console.log('Durée calculée automatiquement:', calculatedDuration, 'heures');
        console.log('Données détaillées:', JSON.stringify(newMissionData, null, 2));
        console.log('Utilisateur connecté:', currentUser);
        
        this.missionService.createMission(newMissionData).subscribe({
          next: (mission) => {
            console.log('Mission créée avec succès:', mission);
            this.notificationService.success('Mission créée avec succès !');
            this.closeMissionModal();
            this.loadMissions(); // Recharger les missions
          },
          error: (error) => {
            console.error('Erreur complète lors de la création:', error);
            console.error('Status de l\'erreur:', error.status);
            console.error('Message d\'erreur:', error.error);
            console.error('Corps de la réponse d\'erreur:', JSON.stringify(error.error, null, 2));
            
            let errorMessage = 'Erreur lors de la création de la mission';
            if (error.error?.message) {
              errorMessage += ': ' + error.error.message;
            } else if (error.error?.error) {
              errorMessage += ': ' + error.error.error;
            } else if (error.message) {
              errorMessage += ': ' + error.message;
            }
            
            this.notificationService.error(errorMessage);
          }
        });
      }
    } else {
      this.notificationService.warning('Veuillez remplir tous les champs obligatoires');
    }
  }

  async publierMission(mission: Mission) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Publier la mission',
      message: 'Êtes-vous sûr de vouloir publier cette mission ?',
      confirmText: 'Publier',
      cancelText: 'Annuler',
      type: 'info'
    });
    
    if (confirmed) {
      mission.statut = 'publiee';
      this.notificationService.success('Mission publiée avec succès !');
    }
  }

  async supprimerMission(mission: Mission) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer la mission',
      message: 'Êtes-vous sûr de vouloir supprimer cette mission ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    
    if (confirmed) {
      this.missions = this.missions.filter(m => m.id !== mission.id);
      this.notificationService.success('Mission supprimée avec succès !');
    }
  }

  // Gestion des candidatures
  openCandidatureModal(candidature: Candidature) {
    this.selectedCandidature = candidature;
    this.showCandidatureModal = true;
  }

  closeCandidatureModal() {
    this.showCandidatureModal = false;
    this.selectedCandidature = null;
  }  async accepterCandidature(candidature: Candidature) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Accepter la candidature',
      message: 'Êtes-vous sûr de vouloir accepter cette candidature ?',
      confirmText: 'Accepter',
      cancelText: 'Annuler',
      type: 'info'
    });
    
    if (confirmed) {
      // Appeler l'API pour mettre à jour le statut
      this.candidatureService.updateCandidatureStatut(candidature.id, { statut: 'Acceptée' }).subscribe({
        next: (response) => {
          // Update local data
          candidature.statut = 'acceptee';
          
          // Update the mission
          const mission = this.missions.find(m => m.id === candidature.missionId);
          if (mission) {
            mission.statut = 'pourvue';
            mission.interimaire = candidature.interimaire;
            
            // Si la mission a des informations de planification, marquer comme planifiée
            if (mission.dateMission && mission.heureDebut) {
              const updateData = {
                estPlanifiee: true
              };
              
              this.missionService.updateMission(mission.id, updateData).subscribe({
                next: () => {
                  console.log('Mission automatiquement planifiée');
                  this.notificationService.info('Mission ajoutée au planning automatiquement');
                },
                error: (error) => {
                  console.error('Erreur lors de la planification automatique:', error);
                }
              });
            }
          }
          
          this.closeCandidatureModal();
          this.notificationService.success('Candidature acceptée avec succès !');
          
          // Recharger les candidatures pour mettre à jour l'affichage
          this.loadCandidatures();
        },
        error: (error) => {
          console.error('Erreur lors de l\'acceptation de la candidature:', error);
          this.notificationService.error('Erreur lors de l\'acceptation de la candidature. Veuillez réessayer.');
        }
      });
    }
  }

  async refuserCandidature(candidature: Candidature) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Refuser la candidature',
      message: 'Êtes-vous sûr de vouloir refuser cette candidature ?',
      confirmText: 'Refuser',
      cancelText: 'Annuler',
      type: 'warning'
    });
    
    if (confirmed) {
      // Appeler l'API pour mettre à jour le statut
      this.candidatureService.updateCandidatureStatut(candidature.id, { statut: 'Refusée' }).subscribe({
        next: (response) => {
          // Update local data
          candidature.statut = 'refusee';
          
          this.closeCandidatureModal();
          this.notificationService.warning('Candidature refusée.');
          
          // Recharger les candidatures pour mettre à jour l'affichage
          this.loadCandidatures();
        },
        error: (error) => {
          console.error('Erreur lors du refus de la candidature:', error);
          this.notificationService.error('Erreur lors du refus de la candidature. Veuillez réessayer.');
        }
      });
    }
  }

  // Getter pour les candidatures en attente uniquement
  get candidaturesEnAttente(): Candidature[] {
    return this.candidatures.filter(candidature => candidature.statut === 'en_attente');
  }

  // Utilitaires
  getStatutBadgeClass(statut: string): string {
    const classes = {
      'brouillon': 'bg-gray-100 text-gray-800',
      'publiee': 'bg-blue-100 text-blue-800',
      'pourvue': 'bg-green-100 text-green-800',
      'terminee': 'bg-purple-100 text-purple-800',
      'annulee': 'bg-red-100 text-red-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'acceptee': 'bg-green-100 text-green-800',
      'refusee': 'bg-red-100 text-red-800'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getInitials(nom: string): string {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  async logout() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      confirmText: 'Se déconnecter',
      cancelText: 'Annuler',
      type: 'warning'
    });
    
    if (confirmed) {
      this.router.navigate(['/connexion-etablissement']);
    }
  }

  // ===== MÉTHODES POUR LE PLANNING =====
  selectDate(jour: JourCalendrier) {
    this.selectedDate = jour.date;
  }

  openPlanningModal(mission?: PlanningMission) {
    this.selectedPlanningMission = mission || null;
    this.showPlanningModal = true;
  }

  closePlanningModal() {
    this.showPlanningModal = false;
    this.selectedPlanningMission = null;
  }

  getStatutPlanningClass(statut: string): string {
    const classes = {
      'planifiee': 'bg-orange-100 text-orange-800 border-orange-200',
      'confirmee': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_cours': 'bg-green-100 text-green-800 border-green-200',
      'terminee': 'bg-purple-100 text-purple-800 border-purple-200',
      'annulee': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getPeriodTitle(): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long',
      day: this.viewMode === 'day' ? 'numeric' : undefined
    };
    
    if (this.viewMode === 'week') {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
    }
    
    return this.currentDate.toLocaleDateString('fr-FR', options);
  }

  getDayNames(): string[] {
    return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  }

  getTimeSlots(): string[] {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }

  getMissionStyle(mission: PlanningMission): any {
    return {
      'background-color': mission.couleur || '#3B82F6',
      'border-left': `4px solid ${mission.couleur || '#3B82F6'}`
    };
  }

  // ===== MÉTHODES POUR LA FACTURATION =====

  loadFacturationData() {
    // Générer des factures basées sur les missions terminées
    this.factures = [
      {
        id: '1',
        numero: 'FACT-2025-001',
        dateEmission: new Date('2025-06-01'),
        dateEcheance: new Date('2025-06-31'),
        periode: {
          debut: new Date('2025-05-01'),
          fin: new Date('2025-05-31')
        },
        missions: [
          {
            mission: this.missions[1],
            interimaire: this.interimaires[0],
            heuresTravaillees: 8,
            tarifHoraire: 22,
            montant: 176,
            periode: '24/05/2025 - 14h00 à 22h00'
          }
        ],
        montantHT: 176,
        tva: 35.20,
        montantTTC: 211.20,
        statut: 'payee',
        datePaiement: new Date('2025-06-15'),
        notes: 'Mission urgences - Aide-soignant'
      },
      {
        id: '2',
        numero: 'FACT-2025-002',
        dateEmission: new Date('2025-06-15'),
        dateEcheance: new Date('2025-07-15'),
        periode: {
          debut: new Date('2025-06-01'),
          fin: new Date('2025-06-15')
        },
        missions: [
          {
            mission: this.missions[0],
            interimaire: this.interimaires[1],
            heuresTravaillees: 36, // 3 nuits de 12h
            tarifHoraire: 28,
            montant: 1008,
            periode: '25/06/2025 au 27/06/2025 - Nuits'
          }
        ],
        montantHT: 1008,
        tva: 201.60,
        montantTTC: 1209.60,
        statut: 'envoyee',
        notes: 'Mission cardiologie - Infirmier de nuit'
      },
      {
        id: '3',
        numero: 'FACT-2025-003',
        dateEmission: new Date('2025-06-10'),
        dateEcheance: new Date('2025-06-25'),
        periode: {
          debut: new Date('2025-05-15'),
          fin: new Date('2025-05-30')
        },
        missions: [
          {
            mission: {
              id: '4',
              titre: 'Kinésithérapeute - Rééducation',
              service: 'Rééducation',
              specialite: 'Kinésithérapeute',
              dateDebut: new Date('2025-05-15'),
              dateFin: new Date('2025-05-30'),
              heureDebut: '08:00',
              heureFin: '16:00',
              tarif: 35,
              statut: 'terminee',
              candidatures: 2,
              urgente: false,
              description: 'Rééducation post-opératoire',
              competencesRequises: ['Rééducation', 'Kinésithérapie']
            },
            interimaire: {
              id: '3',
              prenom: 'Marie',
              nom: 'Leroy',
              specialite: 'Kinésithérapeute',
              experience: 6,
              note: 4.7,
              disponible: true,
              telephone: '06 55 44 33 22',
              email: 'marie.leroy@email.com',
              localisation: 'Paris 15ème',
              tarif: 35,
              derniereConnexion: new Date()
            },
            heuresTravaillees: 120, // 15 jours × 8h
            tarifHoraire: 35,
            montant: 4200,
            periode: '15/05/2025 au 30/05/2025 - Journées'
          }
        ],
        montantHT: 4200,
        tva: 840,
        montantTTC: 5040,
        statut: 'en_retard',
        notes: 'Mission rééducation - Kinésithérapeute'
      }
    ];

    this.calculatePaiementStats();
  }

  calculatePaiementStats() {
    this.paiementStats = {
      totalFacture: this.factures.reduce((sum, f) => sum + f.montantTTC, 0),
      totalPaye: this.factures.filter(f => f.statut === 'payee').reduce((sum, f) => sum + f.montantTTC, 0),
      totalEnAttente: this.factures.filter(f => f.statut === 'envoyee').reduce((sum, f) => sum + f.montantTTC, 0),
      totalEnRetard: this.factures.filter(f => f.statut === 'en_retard').reduce((sum, f) => sum + f.montantTTC, 0),
      nombreFactures: this.factures.length,
      delaiMoyenPaiement: 15 // Simulé
    };
  }

  get facturesFiltrees() {
    return this.factures.filter(facture => {
      const matchStatut = !this.filtreStatutFacture || facture.statut === this.filtreStatutFacture;
      const matchPeriode = !this.filtrePeriode || this.isInPeriod(facture, this.filtrePeriode);
      return matchStatut && matchPeriode;
    });
  }

  isInPeriod(facture: Facture, periode: string): boolean {
    const now = new Date();
    const factureDate = facture.dateEmission;
    
    switch (periode) {
      case 'ce_mois':
        return factureDate.getMonth() === now.getMonth() && factureDate.getFullYear() === now.getFullYear();
      case 'mois_dernier':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return factureDate.getMonth() === lastMonth.getMonth() && factureDate.getFullYear() === lastMonth.getFullYear();
      case 'trimestre':
        const startQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3);
        return factureDate >= startQuarter;
      default:
        return true;
    }
  }

  openFactureModal(facture?: Facture) {
    this.selectedFacture = facture || null;
    this.showFactureModal = true;
  }

  closeFactureModal() {
    this.showFactureModal = false;
    this.selectedFacture = null;
  }

  genererFacture() {
    // Simuler la génération d'une nouvelle fiche de paie
    const nouvelleMissions = this.missions.filter(m => m.statut === 'terminee' && m.interimaire);
    
    if (nouvelleMissions.length === 0) {
      this.notificationService.warning('Aucune mission terminée à rémunérer.');
      return;
    }

    const bulletinNumber = `PAY-2025-${String(this.factures.length + 1).padStart(3, '0')}`;
    
    const missionFactures: FactureMission[] = nouvelleMissions.map(mission => ({
      mission,
      interimaire: mission.interimaire!,
      heuresTravaillees: this.calculateHeuresTravaillees(mission),
      tarifHoraire: mission.tarif,
      montant: this.calculateHeuresTravaillees(mission) * mission.tarif,
      periode: `${this.formatDate(mission.dateDebut)} au ${this.formatDate(mission.dateFin)}`
    }));

    const montantHT = missionFactures.reduce((sum, m) => sum + m.montant, 0);
    const tva = montantHT * 0.2; // 20% TVA
    const montantTTC = montantHT + tva;

    const nouvelleFacture: Facture = {
      id: Date.now().toString(),
      numero: bulletinNumber,
      dateEmission: new Date(),
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      periode: {
        debut: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // -30 jours
        fin: new Date()
      },
      missions: missionFactures,
      montantHT,
      tva,
      montantTTC,
      statut: 'brouillon',
      notes: 'Facture générée automatiquement'
    };

    this.factures.unshift(nouvelleFacture);
    this.calculatePaiementStats();
    this.notificationService.success(`Bulletin de paie ${bulletinNumber} généré avec succès !`);
  }

  calculateHeuresTravaillees(mission: Mission): number {
    // Calcul simplifié des heures travaillées
    const debut = new Date(`1970-01-01T${mission.heureDebut}:00`);
    const fin = new Date(`1970-01-01T${mission.heureFin}:00`);
    
    let heures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
    
    // Si l'heure de fin est avant l'heure de début, c'est une garde de nuit
    if (heures < 0) {
      heures += 24;
    }
    
    // Multiplier par le nombre de jours
    const jours = Math.ceil((mission.dateFin.getTime() - mission.dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return heures * jours;
  }

  async marquerCommePayee(facture: Facture) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Marquer comme payée',
      message: `Marquer la facture ${facture.numero} comme payée ?`,
      confirmText: 'Marquer payée',
      cancelText: 'Annuler',
      type: 'info'
    });
    
    if (confirmed) {
      facture.statut = 'payee';
      facture.datePaiement = new Date();
      this.calculatePaiementStats();
      this.notificationService.success('Facture marquée comme payée !');
    }
  }

  async envoyerFacture(facture: Facture) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Envoyer la facture',
      message: `Envoyer la facture ${facture.numero} ?`,
      confirmText: 'Envoyer',
      cancelText: 'Annuler',
      type: 'info'
    });
    
    if (confirmed) {
      facture.statut = 'envoyee';
      this.notificationService.success('Facture envoyée avec succès !');
    }
  }

  async annulerFacture(facture: Facture) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Annuler la facture',
      message: `Êtes-vous sûr de vouloir annuler la facture ${facture.numero} ?`,
      confirmText: 'Annuler la facture',
      cancelText: 'Retour',
      type: 'warning'
    });
    
    if (confirmed) {
      facture.statut = 'annulee';
      this.calculatePaiementStats();
      this.notificationService.warning('Facture annulée.');
    }
  }

  telechargerFacture(facture: Facture) {
    // Simuler le téléchargement d'une fiche de paie
    this.notificationService.info(`Téléchargement du bulletin de paie ${facture.numero} (PDF)`);
  }

  getStatutFactureClass(statut: string): string {
    const classes = {
      'brouillon': 'bg-gray-100 text-gray-800',
      'envoyee': 'bg-blue-100 text-blue-800',
      'payee': 'bg-green-100 text-green-800',
      'en_retard': 'bg-red-100 text-red-800',
      'annulee': 'bg-red-100 text-red-800'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatutFactureLabel(statut: string): string {
    const labels = {
      'brouillon': 'Brouillon',
      'envoyee': 'À valider',  // CHANGÉ
      'payee': 'Payée',
      'en_retard': 'En retard',
      'annulee': 'Annulée'
    };
    return labels[statut as keyof typeof labels] || statut;
  }

  getStatutFactureIcon(statut: string): string {
    const icons = {
      'brouillon': '📝',
      'envoyee': '📤',
      'payee': '✅',
      'en_retard': '⚠️',
      'annulee': '❌'
    };
    return icons[statut as keyof typeof icons] || '📄';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Méthodes pour les filtres de factures (pour éviter les erreurs dans le template)
  getFacturesPayees(): number {
    return this.factures.filter(f => f.statut === 'payee').length;
  }

  getFacturesEnvoyees(): number {
    return this.factures.filter(f => f.statut === 'envoyee').length;
  }

  getFacturesEnRetard(): number {
    return this.factures.filter(f => f.statut === 'en_retard').length;
  }

  getFacturesCeMois(): number {
    return this.factures.filter(f => this.isInPeriod(f, 'ce_mois')).length;
  }

  // ===== MÉTHODES POUR LES STATISTIQUES =====
  loadStatistiquesDetaillees() {
    // Missions par mois (12 derniers mois)
    this.statistiquesDetaillees.missionsParMois = [
      { mois: 'Jan 2025', nombre: 15 },
      { mois: 'Fév 2025', nombre: 22 },
      { mois: 'Mar 2025', nombre: 18 },
      { mois: 'Avr 2025', nombre: 25 },
      { mois: 'Mai 2025', nombre: 30 },
      { mois: 'Juin 2025', nombre: 28 }
    ];

    // Missions par service
    const totalMissions = this.missions.length;
    this.statistiquesDetaillees.missionsParService = [
      { service: 'Urgences', nombre: 45, pourcentage: 32 },
      { service: 'Cardiologie', nombre: 35, pourcentage: 25 },
      { service: 'Neurologie', nombre: 25, pourcentage: 18 },
      { service: 'Chirurgie', nombre: 20, pourcentage: 14 },
      { service: 'Pédiatrie', nombre: 15, pourcentage: 11 }
    ];

    // Missions par spécialité
    this.statistiquesDetaillees.missionsParSpecialite = [
      { specialite: 'Infirmier(ère)', nombre: 65, dureemoyenne: 8.5 },
      { specialite: 'Aide-soignant', nombre: 40, dureemoyenne: 7.2 },
      { specialite: 'Médecin', nombre: 20, dureemoyenne: 10.3 },
      { specialite: 'Kinésithérapeute', nombre: 15, dureemoyenne: 6.8 }
    ];

    // Intérimaires par spécialité
    this.statistiquesDetaillees.interimairesParSpecialite = [
      { specialite: 'Infirmier(ère)', nombre: 25, notemoyenne: 4.3 },
      { specialite: 'Aide-soignant', nombre: 18, notemoyenne: 4.1 },
      { specialite: 'Médecin', nombre: 8, notemoyenne: 4.6 },
      { specialite: 'Kinésithérapeute', nombre: 12, notemoyenne: 4.4 }
    ];

    // Évolution des intérimaires
    this.statistiquesDetaillees.evolutionInterimaires = [
      { mois: 'Jan', actifs: 45, nouveaux: 5 },
      { mois: 'Fév', actifs: 48, nouveaux: 7 },
      { mois: 'Mar', actifs: 52, nouveaux: 8 },
      { mois: 'Avr', actifs: 55, nouveaux: 6 },
      { mois: 'Mai', actifs: 58, nouveaux: 9 },
      { mois: 'Juin', actifs: 63, nouveaux: 10 }
    ];

    // Coûts mensuels
    this.statistiquesDetaillees.coutsMensuels = [
      { mois: 'Jan', montant: 45200, heures: 2010 },
      { mois: 'Fév', montant: 52800, heures: 2340 },
      { mois: 'Mar', montant: 48600, heures: 2150 },
      { mois: 'Avr', montant: 56400, heures: 2500 },
      { mois: 'Mai', montant: 61200, heures: 2720 },
      { mois: 'Juin', montant: 58900, heures: 2610 }
    ];

    // Comparaison tarifs
    this.statistiquesDetaillees.comparaisonTarifs = [
      { specialite: 'Infirmier(ère)', tarifMoyen: 25, tarifMarche: 28 },
      { specialite: 'Aide-soignant', tarifMoyen: 22, tarifMarche: 24 },
      { specialite: 'Médecin', tarifMoyen: 45, tarifMarche: 50 },
      { specialite: 'Kinésithérapeute', tarifMoyen: 35, tarifMarche: 38 }
    ];

    // Délais de pourvoi
    this.statistiquesDetaillees.delaisPourvoi = [
      { mois: 'Jan', delaiMoyen: 2.3 },
      { mois: 'Fév', delaiMoyen: 1.8 },
      { mois: 'Mar', delaiMoyen: 2.1 },
      { mois: 'Avr', delaiMoyen: 1.5 },
      { mois: 'Mai', delaiMoyen: 1.2 },
      { mois: 'Juin', delaiMoyen: 1.4 }
    ];

    // Taux de satisfaction
    this.statistiquesDetaillees.tauxSatisfaction = [
      { mois: 'Jan', taux: 4.2 },
      { mois: 'Fév', taux: 4.3 },
      { mois: 'Mar', taux: 4.1 },
      { mois: 'Avr', taux: 4.4 },
      { mois: 'Mai', taux: 4.5 },
      { mois: 'Juin', taux: 4.6 }
    ];

    // Économies réalisées
    this.statistiquesDetaillees.economiesRealisees = [
      { categorie: 'Évitement heures supplémentaires', montant: 15400 },
      { categorie: 'Réduction absentéisme', montant: 8900 },
      { categorie: 'Optimisation planning', montant: 12600 },
      { categorie: 'Négociation tarifs', montant: 7200 }
    ];
  }

  // Calculs de tendances
  getTendanceMissions(): { valeur: number; tendance: 'hausse' | 'baisse' | 'stable' } {
    const missions = this.statistiquesDetaillees.missionsParMois;
    if (missions.length < 2) return { valeur: 0, tendance: 'stable' };
    
    const dernierMois = missions[missions.length - 1].nombre;
    const moisPrecedent = missions[missions.length - 2].nombre;
    const pourcentage = ((dernierMois - moisPrecedent) / moisPrecedent) * 100;
    
    return {
      valeur: Math.abs(pourcentage),
      tendance: pourcentage > 5 ? 'hausse' : pourcentage < -5 ? 'baisse' : 'stable'
    };
  }

  getTendanceCouts(): { valeur: number; tendance: 'hausse' | 'baisse' | 'stable' } {
    const couts = this.statistiquesDetaillees.coutsMensuels;
    if (couts.length < 2) return { valeur: 0, tendance: 'stable' };
    
    const dernierMois = couts[couts.length - 1].montant;
    const moisPrecedent = couts[couts.length - 2].montant;
    const pourcentage = ((dernierMois - moisPrecedent) / moisPrecedent) + 100;
    
    return {
      valeur: Math.abs(pourcentage),
      tendance: pourcentage > 5 ? 'hausse' : pourcentage < -5 ? 'baisse' : 'stable'
    };
  }

  getTendanceInterimaires(): { valeur: number; tendance: 'hausse' | 'baisse' | 'stable' } {
    const interimaires = this.statistiquesDetaillees.evolutionInterimaires;
    if (interimaires.length < 2) return { valeur: 0, tendance: 'stable' };
    
    const dernierMois = interimaires[interimaires.length - 1].actifs;
    const moisPrecedent = interimaires[interimaires.length - 2].actifs;
    const pourcentage = ((dernierMois - moisPrecedent) / moisPrecedent) * 100;
    
    return {
      valeur: Math.abs(pourcentage),
      tendance: pourcentage > 3 ? 'hausse' : pourcentage < -3 ? 'baisse' : 'stable'
    };
  }

  getTendanceIcon(tendance: 'hausse' | 'baisse' | 'stable'): string {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  }

  getTendanceClass(tendance: 'hausse' | 'baisse' | 'stable'): string {
    switch (tendance) {
      case 'hausse': return 'text-green-600';
      case 'baisse': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  // Méthodes utilitaires
  getMaxValue(data: any[], key: string): number {
    return Math.max(...data.map(item => item[key]));
  }

  getPercentageWidth(value: number, max: number): number {
    return (value / max) * 100;
  }

  getColorForSpecialite(specialite: string): string {
    const colors = {
      'Infirmier(ère)': '#3B82F6',
      'Aide-soignant': '#10B981',
      'Médecin': '#F59E0B',
      'Kinésithérapeute': '#8B5CF6'
    };
    return colors[specialite as keyof typeof colors] || '#6B7280';
  }

  getTotalEconomies(): number {
    return this.statistiquesDetaillees.economiesRealisees.reduce((sum, item) => sum + item.montant, 0);
  }

  getMoyenneSatisfaction(): number {
    const satisfaction = this.statistiquesDetaillees.tauxSatisfaction;
    if (satisfaction.length === 0) return 0;
    return satisfaction.reduce((sum, item) => sum + item.taux, 0) / satisfaction.length;
  }

  getDelaiMoyenPourvoi(): number {
    const delais = this.statistiquesDetaillees.delaisPourvoi;
    if (delais.length === 0) return 0;
    return delais.reduce((sum, item) => sum + item.delaiMoyen, 0) / delais.length;
  }

 

  // Ajoutez cette méthode après initParametresForm()
  loadEtablissementData() {
    this.authService.getCurrentEtablissement().subscribe({
      next: (data) => {
        console.log('Données établissement reçues:', data);
        this.etablissement = {
          nom: data.nom || '',
          type: data.typeEtablissement || '',
          adresse: data.adresse || '',
          telephone: data.telephone || '',
          email: data.email || '',
          siret: data.numeroSiret || '',
          responsable: data.responsable || '',
          description: data.description || '',
          services: data.services || []
        };
        
        // Mettre à jour le profil sidebar
        this.sidebarEtablissementProfile = {
          nom: data.nom || '',
          responsable: data.responsable || '',
          initials: this.getInitials(data.nom || 'ET')
        };

        // Mettre à jour le formulaire de paramètres
        this.updateParametresForm();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données établissement:', error);
        this.showNotification('Erreur lors du chargement des données', 'error');
      }
    });
  }

  updateParametresForm() {
    if (this.parametresForm) {
      this.parametresForm.patchValue({
        nom: this.etablissement.nom,
        type: this.etablissement.type,
        adresse: this.etablissement.adresse,
        telephone: this.etablissement.telephone,
        email: this.etablissement.email,
        siret: this.etablissement.siret,
        responsable: this.etablissement.responsable,
        description: this.etablissement.description
      });
    }
  }

  saveParametres() {
    if (this.parametresForm.valid) {
      this.isUpdatingParametres = true;
      const formData = this.parametresForm.value;

      this.authService.updateEtablissement(formData).subscribe({
        next: (response) => {
          this.showNotification('Informations mises à jour avec succès', 'success');
          this.loadEtablissementData(); // Recharger les données
          this.isUpdatingParametres = false;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.showNotification('Erreur lors de la mise à jour', 'error');
          this.isUpdatingParametres = false;
        }
      });
    } else {
      this.showNotification('Veuillez vérifier les informations saisies', 'error');
    }
  }

  resetParametres() {
    this.updateParametresForm();
    this.showNotification('Modifications annulées', 'info');
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info') {
    console.log(`${type}: ${message}`);
    this.notificationService.info(message); // Solution temporaire
  }
}
