import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { InterimaireService } from '../../services/interimaire/intermaire.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';

interface Document {
  id: string;
  nom: string;
  type: string;
  categorie: 'cv' | 'diplome' | 'identite' | 'rib' | 'secu';
  dateUpload: Date;
  dateExpiration?: Date;
  statut: 'valide' | 'attente' | 'expire' | 'refuse';
  taille: string;
  url?: string;
}

interface Mission {
  id: string;
  etablissement: string;
  service: string;
  specialite: string;
  dateMission: Date;
  heureDebut: string;
  heureFin: string;
  duree: number; // en heures
  statut: 'confirmee' | 'en_attente' | 'annulee' | 'terminee';
  adresse: string;
  contact: string;
  remuneration: number;
  description?: string;
}

interface Message {
  id: string;
  expediteur: string;
  sujet: string;
  contenu: string;
  dateEnvoi: Date;
  lu: boolean;
  important: boolean;
  urgent: boolean;
  categorie: 'mission' | 'administrative' | 'planning' | 'generale' | 'technique';
  pieceJointe?: string;
}

// NOUVELLES INTERFACES À AJOUTER :
interface NotificationSettings {
  email: {
    missions: boolean;
    confirmations: boolean;
    rappels: boolean;
    messages: boolean;
  };
  sms: {
    urgent: boolean;
    rappels24h: boolean;
    changements: boolean;
  };
  push: {
    enabled: boolean;
  };
}

interface WorkPreferences {
  zones: string[];
  etablissements: string[];
  heureDebutMin: string;
  heureFinMax: string;
  distanceMax: number;
}

interface SecuritySettings {
  twoFactor: {
    enabled: boolean;
    phone: string;
  };
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: Date;
  current: boolean;
}

interface Zone {
  id: string;
  nom: string;
}

interface EtablissementType {
  id: string;
  nom: string;
}

interface FaqItem {
  question: string;
  reponse: string;
  open: boolean;
}

@Component({
  selector: 'app-dashboard-interimaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, AvatarComponent],
  templateUrl: './dashboard-interimaire.component.html',
  styleUrl: './dashboard-interimaire.component.css',
})
export class DashboardInterimaireComponent implements OnInit {
  activeSection: string = 'profil';
  isEditing: boolean = false;
  profileForm!: FormGroup;
  
  // Documents
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  selectedCategory: string = '';
  selectedStatus: string = '';
  searchTerm: string = '';
  showUploadModal: boolean = false;
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  currentUploadType: string = '';
  
  // Planning
  calendarView: 'day' | 'week' | 'month' = 'week';
  currentDate: Date;
  missions: Mission[] = [];
  
  // Messages
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  messageFilter: 'tous' | 'non_lus' | 'importants' = 'tous';
  messageSearchTerm: string = '';
  selectedMessage: Message | null = null;
  showNewMessageModal: boolean = false;
  newMessageForm!: FormGroup;

  // AJOUTEZ CES PROPRIÉTÉS POUR LES PARAMÈTRES :
  // Paramètres
  parameterSection: 'compte' | 'notifications' | 'preferences' | 'securite' | 'support' = 'compte';
  settingsForm!: FormGroup;
  passwordForm!: FormGroup;

  // Données des paramètres
  notificationSettings: NotificationSettings = {
    email: {
      missions: true,
      confirmations: true,
      rappels: true,
      messages: false
    },
    sms: {
      urgent: true,
      rappels24h: true,
      changements: false
    },
    push: {
      enabled: true
    }
  };

  workPreferences: WorkPreferences = {
    zones: ['paris', 'hautsdeseine'],
    etablissements: ['hopital', 'clinique'],
    heureDebutMin: '06:00',
    heureFinMax: '22:00',
    distanceMax: 30
  };

  securitySettings: SecuritySettings = {
    twoFactor: {
      enabled: false,
      phone: '+33 6 12 34 56 78'
    }
  };

  activeSessions: ActiveSession[] = [];
  availableZones: Zone[] = [];
  etablissementTypes: EtablissementType[] = [];
  faqItems: FaqItem[] = [];
  userProfile = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    specialite: '',
    experience: 0
  };

  // Email support (pour éviter les problèmes avec @)
  supportEmail = 'support@alenia.fr';

  // Méthode pour générer les initiales de l'utilisateur
  getUserInitials(): string {
    const prenom = this.userProfile.prenom || '';
    const nom = this.userProfile.nom || '';
    
    const prenomInitial = prenom.charAt(0).toUpperCase();
    const nomInitial = nom.charAt(0).toUpperCase();
    
    return `${prenomInitial}${nomInitial}`;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private interimaireService: InterimaireService
  ) {
    this.currentDate = new Date();
  }

  getCurrentFrenchDate(): Date {
    return new Date();
  }
  ngOnInit() {
    this.loadUserProfileFromAuth(); // Charger le profil utilisateur depuis l'auth
    this.initProfileForm();
    this.initUploadForm();
    this.initNewMessageForm();
    this.initSettingsForm();        // NOUVELLE LIGNE
    this.initPasswordForm();        // NOUVELLE LIGNE
    this.loadDocuments();
    this.loadMissions();
    this.loadMessages();
    this.loadParametersData();      // NOUVELLE LIGNE
  }

  // Ajout de la méthode manquante pour éviter l'erreur
  loadParametersData() {
    // Zones géographiques disponibles
    this.availableZones = [
      { id: 'paris', nom: 'Paris (75)' },
      { id: 'hautsdeseine', nom: 'Hauts-de-Seine (92)' },
      { id: 'seinestdenis', nom: 'Seine-Saint-Denis (93)' },
      { id: 'valdemarne', nom: 'Val-de-Marne (94)' },
      { id: 'valdoise', nom: 'Val-d\'Oise (95)' },
      { id: 'seineetmarne', nom: 'Seine-et-Marne (77)' },
      { id: 'yvelines', nom: 'Yvelines (78)' },
      { id: 'essonne', nom: 'Essonne (91)' }
    ];

    // Types d'établissements
    this.etablissementTypes = [
      { id: 'hopital', nom: 'Hôpitaux publics' },
      { id: 'clinique', nom: 'Cliniques privées' },
      { id: 'ehpad', nom: 'EHPAD' },
      { id: 'had', nom: 'Hospitalisation à domicile' },
      { id: 'centre_sante', nom: 'Centres de santé' },
      { id: 'laboratoire', nom: 'Laboratoires' }
    ];

    // Sessions actives
    this.activeSessions = [
      {
        id: '1',
        device: 'Chrome sur Windows',
        location: 'Paris, France',
        lastActive: new Date(),
        current: true
      },
      {
        id: '2',
        device: 'Safari sur iPhone',
        location: 'Paris, France',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        current: false
      }
    ];

    // FAQ
    this.faqItems = [
      {
        question: 'Comment modifier mes informations personnelles ?',
        reponse: 'Rendez-vous dans la section "Mon compte" des paramètres, modifiez les champs souhaités et cliquez sur "Sauvegarder".',
        open: false
      },
      {
        question: 'Comment recevoir les notifications par SMS ?',
        reponse: 'Dans la section "Notifications", activez les notifications SMS pour les types d\'alertes que vous souhaitez recevoir.',
        open: false
      },
      {
        question: 'Que faire si j\'oublie mon mot de passe ?',
        reponse: 'Utilisez le lien "Mot de passe oublié" sur la page de connexion pour réinitialiser votre mot de passe.',
        open: false
      },
      {
        question: 'Comment configurer mes préférences de missions ?',
        reponse: 'Dans "Préférences", sélectionnez vos zones géographiques, types d\'établissements et créneaux horaires préférés.',
        open: false
      },
      {
        question: 'L\'authentification à deux facteurs est-elle obligatoire ?',
        reponse: 'Non, mais nous la recommandons fortement pour sécuriser votre compte.',
        open: false
      }
    ];
  }

  // ===== MÉTHODES PROFIL =====
  initProfileForm() {
    this.profileForm = this.fb.group({
      prenom: [this.userProfile.prenom, [Validators.required, Validators.minLength(2)]],
      nom: [this.userProfile.nom, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      telephone: [this.userProfile.telephone, [Validators.required]],
      specialite: [this.userProfile.specialite, [Validators.required]],
      experience: [this.userProfile.experience, [Validators.required, Validators.min(0)]]
    });
    this.profileForm.disable();
  }

  initUploadForm() {
    this.uploadForm = this.fb.group({
      nom: ['', [Validators.required]],
      categorie: ['', [Validators.required]],
      dateExpiration: ['']
    });
  }

  initNewMessageForm() {
    this.newMessageForm = this.fb.group({
      destinataire: ['', [Validators.required]],
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      contenu: ['', [Validators.required, Validators.minLength(10)]],
      urgent: [false]
    });
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.isEditing = false;
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      'profil': 'Mon Profil',
      'missions': 'Mes Missions',
      'planning': 'Mon Planning',
      'documents': 'Mes Documents',
      'messages': 'Messages',
      'parametres': 'Paramètres'
    };
    return titles[this.activeSection] || 'Dashboard';
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.profileForm.disable();
    this.profileForm.patchValue(this.userProfile);
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.userProfile = { ...this.profileForm.value };
      this.isEditing = false;
      this.profileForm.disable();
      
      console.log('Profile updated:', this.userProfile);
      alert('Profil mis à jour avec succès !');
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.router.navigate(['/connexion']);
    }
  }

  // ===== MÉTHODES DOCUMENTS =====
  loadDocuments() {
    this.documents = [
      {
        id: '1',
        nom: 'CV_Jean_Dupont_2024.pdf',
        type: 'pdf',
        categorie: 'cv',
        dateUpload: new Date('2024-01-15'),
        statut: 'valide',
        taille: '1.2 MB'
      },
      {
        id: '2',
        nom: 'Diplome_Infirmier.pdf',
        type: 'pdf',
        categorie: 'diplome',
        dateUpload: new Date('2024-01-10'),
        statut: 'valide',
        taille: '800 KB'
      }
    ];
    this.filteredDocuments = [...this.documents];
  }

  getDocument(type: string): Document | undefined {
    return this.documents.find(doc => doc.categorie === type);
  }

  getCompletedDocuments(): number {
    const requiredTypes = ['cv', 'diplome', 'identite', 'rib', 'secu'];
    return requiredTypes.filter(type => this.getDocument(type)).length;
  }

  getProgressPercentage(): number {
    return Math.round((this.getCompletedDocuments() / 5) * 100);
  }

  openUploadModal(type: string) {
    this.currentUploadType = type;
    this.showUploadModal = true;
    this.uploadForm.patchValue({
      categorie: type,
      nom: ''
    });
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.selectedFile = null;
    this.uploadForm.reset();
    this.currentUploadType = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximum : 10MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'image/jpeg', 'image/png', 'image/jpg'];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier non autorisé. Utilisez : PDF, DOC, DOCX, JPG, PNG');
        return;
      }

      this.selectedFile = file;
      const suggestedName = this.generateDocumentName(this.currentUploadType, file.name);
      this.uploadForm.patchValue({ nom: suggestedName });
    }
  }

  generateDocumentName(type: string, fileName: string): string {
    const typeLabels = {
      'cv': 'CV',
      'diplome': 'Diplôme',
      'identite': 'Pièce d\'identité',
      'rib': 'RIB',
      'secu': 'Attestation Sécurité Sociale'
    };
    
    const label = typeLabels[type as keyof typeof typeLabels] || type;
    const extension = fileName.split('.').pop();
    return `${label}_${this.userProfile.prenom}_${this.userProfile.nom}.${extension}`;
  }

  uploadDocument() {
    if (!this.selectedFile || !this.uploadForm.valid) {
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      nom: this.uploadForm.value.nom || this.selectedFile.name,
      type: this.selectedFile.type,
      categorie: this.currentUploadType as any,
      dateUpload: new Date(),
      dateExpiration: this.uploadForm.value.dateExpiration ? new Date(this.uploadForm.value.dateExpiration) : undefined,
      statut: 'attente',
      taille: this.getFileSize(this.selectedFile.size)
    };

    const existingIndex = this.documents.findIndex(doc => doc.categorie === this.currentUploadType);
    if (existingIndex !== -1) {
      this.documents[existingIndex] = newDocument;
    } else {
      this.documents.push(newDocument);
    }

    this.filteredDocuments = [...this.documents];
    this.closeUploadModal();
    alert(`Document "${newDocument.nom}" ajouté avec succès !`);
  }

  replaceDocument(type: string) {
    if (confirm('Êtes-vous sûr de vouloir remplacer ce document ?')) {
      this.openUploadModal(type);
    }
  }

  viewDocument(document: Document | undefined) {
    if (!document) return;
    alert(`Ouverture du document : ${document.nom}`);
  }

  downloadDocument(document: Document | undefined) {
    if (!document) return;
    alert(`Téléchargement du document : ${document.nom}`);
  }

  deleteDocument(document: Document) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${document.nom}" ?`)) {
      this.documents = this.documents.filter(doc => doc.id !== document.id);
      this.filteredDocuments = [...this.documents];
      alert('Document supprimé avec succès !');
    }
  }

  getDocumentTypeLabel(type: string): string {
    const labels = {
      'cv': 'CV',
      'diplome': 'Diplôme',
      'identite': 'Pièce d\'identité',
      'rib': 'RIB/IBAN',
      'secu': 'Attestation Sécurité Sociale'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  filterDocuments() {
    this.filteredDocuments = this.documents.filter(doc => {
      const matchesCategory = !this.selectedCategory || doc.categorie === this.selectedCategory;
      const matchesStatus = !this.selectedStatus || doc.statut === this.selectedStatus;
      const matchesSearch = !this.searchTerm || 
        doc.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }

  getValidatedDocuments(): number {
    return this.documents.filter(doc => doc.statut === 'valide').length;
  }

  getPendingDocuments(): number {
    return this.documents.filter(doc => doc.statut === 'attente').length;
  }

  getExpiredDocuments(): number {
    return this.documents.filter(doc => doc.statut === 'expire').length;
  }

  // ===== MÉTHODES PLANNING =====
  loadMissions() {
    const today = new Date();
    
    this.missions = [
      {
        id: '1',
        etablissement: 'Hôpital Saint-Antoine',
        service: 'Urgences',
        specialite: 'Infirmier',
        dateMission: this.addDays(today, 1),
        heureDebut: '08:00',
        heureFin: '16:00',
        duree: 8,
        statut: 'confirmee',
        adresse: '184 Rue du Faubourg Saint-Antoine, 75012 Paris',
        contact: 'Dr. Martin - 01 49 28 20 00',
        remuneration: 200
      },
      {
        id: '2',
        etablissement: 'Clinique du Parc',
        service: 'Chirurgie',
        specialite: 'Infirmier',
        dateMission: this.addDays(today, 2),
        heureDebut: '14:00',
        heureFin: '22:00',
        duree: 8,
        statut: 'confirmee',
        adresse: '25 Boulevard Victor Hugo, 92200 Neuilly',
        contact: 'Mme Dubois - 01 46 25 30 00',
        remuneration: 220
      },
      {
        id: '3',
        etablissement: 'EHPAD Les Lilas',
        service: 'Gériatrie',
        specialite: 'Aide-soignant',
        dateMission: this.addDays(today, 3),
        heureDebut: '06:00',
        heureFin: '14:00',
        duree: 8,
        statut: 'en_attente',
        adresse: '12 Rue des Lilas, 93260 Les Lilas',
        contact: 'M. Rousseau - 01 48 97 15 00',
        remuneration: 180
      },
      {
        id: '4',
        etablissement: 'Centre Médical Voltaire',
        service: 'Médecine générale',
        specialite: 'Infirmier',
        dateMission: this.addDays(today, 4),
        heureDebut: '09:00',
        heureFin: '17:00',
        duree: 8,
        statut: 'confirmee',
        adresse: '45 Avenue Voltaire, 75011 Paris',
        contact: 'Dr. Leroy - 01 43 79 25 00',
        remuneration: 210
      },
      {
        id: '5',
        etablissement: 'Hôpital Tenon',
        service: 'Cardiologie',
        specialite: 'Infirmier',
        dateMission: this.addDays(today, 5),
        heureDebut: '12:00',
        heureFin: '20:00',
        duree: 8,
        statut: 'en_attente',
        adresse: '4 Rue de la Chine, 75020 Paris',
        contact: 'Dr. Bernard - 01 56 01 70 00',
        remuneration: 230
      }
    ];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  setCalendarView(view: 'day' | 'week' | 'month') {
    this.calendarView = view;
  }

  getCurrentPeriodLabel(): string {
    switch (this.calendarView) {
      case 'day':
        return this.currentDate.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      case 'week':
        const weekStart = this.getWeekStart();
        const weekEnd = this.getWeekEnd();
        return `Semaine du ${weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      case 'month':
        return this.currentDate.toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        });
      default:
        return '';
    }
  }

  previousPeriod() {
    const newDate = new Date(this.currentDate);
    switch (this.calendarView) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    this.currentDate = newDate;
  }

  nextPeriod() {
    const newDate = new Date(this.currentDate);
    switch (this.calendarView) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    this.currentDate = newDate;
  }

  today() {
    this.currentDate = new Date();
  }

  getThisWeekHours(): number {
    const weekStart = this.getWeekStart();
    const weekEnd = this.getWeekEnd();
    
    return this.missions
      .filter(mission => {
        const missionDate = new Date(mission.dateMission);
        return missionDate >= weekStart && missionDate <= weekEnd;
      })
      .reduce((total, mission) => total + mission.duree, 0);
  }

  getThisMonthHours(): number {
    const monthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const monthEnd = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    
    return this.missions
      .filter(mission => {
        const missionDate = new Date(mission.dateMission);
        return missionDate >= monthStart && missionDate <= monthEnd;
      })
      .reduce((total, mission) => total + mission.duree, 0);
  }

  getUpcomingMissions(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.missions.filter(mission => {
      const missionDate = new Date(mission.dateMission);
      missionDate.setHours(0, 0, 0, 0);
      return missionDate >= today;
    }).length;
  }

  getAvailabilityPercentage(): number {
    return 75; // Simulation
  }

  getHours(): string[] {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  }

  getWorkingHours(): number[] {
    return Array.from({ length: 14 }, (_, i) => i + 6);
  }

  getWeekStart(): Date {
    const date = new Date(this.currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  getWeekEnd(): Date {
    const weekStart = this.getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }

  getWeekDays(): Date[] {
    const weekStart = this.getWeekStart();
    const days: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    
    return days;
  }

  getDayNames(): string[] {
    return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  }

  getMonthDays(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth() && 
           date.getFullYear() === this.currentDate.getFullYear();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Méthode pour gérer les missions qui commencent avant 6h ou finissent après 22h
  isDayMissionVisible(mission: Mission): boolean {
    const startHour = parseInt(mission.heureDebut.split(':')[0]);
    const endHour = parseInt(mission.heureFin.split(':')[0]);
    
    // Afficher la mission si elle a au moins une partie dans la plage 6h-22h
    return !(endHour <= 6 || startHour >= 22);
  }

  getDayMissions(date: Date): Mission[] {
    return this.missions.filter(mission => {
      const missionDate = new Date(mission.dateMission);
      return missionDate.toDateString() === date.toDateString() && 
             this.isDayMissionVisible(mission);
    });
  }

  getHourMissions(date: Date, hour: number): Mission[] {
    return this.getDayMissions(date).filter(mission => {
      const startHour = parseInt(mission.heureDebut.split(':')[0]);
      const endHour = parseInt(mission.heureFin.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });
  }

  getMissionPosition(mission: Mission): { left: number, width: number, top: number } {
    const startHour = parseInt(mission.heureDebut.split(':')[0]);
    const startMinute = parseInt(mission.heureDebut.split(':')[1]);
    const endHour = parseInt(mission.heureFin.split(':')[0]);
    const endMinute = parseInt(mission.heureFin.split(':')[1]);
    
    const startPercent = ((startHour + startMinute / 60) / 24) * 100;
    const duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);
    const widthPercent = (duration / 24) * 100;
    
    return {
      left: startPercent,
      width: widthPercent,
      top: 10
    };
  }

  getUpcomingMissionsList(): Mission[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.missions
      .filter(mission => {
        const missionDate = new Date(mission.dateMission);
        missionDate.setHours(0, 0, 0, 0);
        return missionDate >= today;
      })
      .sort((a, b) => new Date(a.dateMission).getTime() - new Date(b.dateMission).getTime());
  }

  getMissionStatusClass(statut: string): string {
    const classes = {
      'confirmee': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'annulee': 'bg-red-100 text-red-800',
      'terminee': 'bg-gray-100 text-gray-800'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getMissionStatusLabel(statut: string): string {
    const labels = {
      'confirmee': 'Confirmée',
      'en_attente': 'En attente',
      'annulee': 'Annulée',
      'terminee': 'Terminée'
    };
    return labels[statut as keyof typeof labels] || statut;
  }

  // Méthodes spécifiques pour la vue jour
  getDayHours(): string[] {
    // Afficher de 6h à 22h pour la vue jour
    return Array.from({ length: 17 }, (_, i) => {
      const hour = i + 6;
      return hour.toString().padStart(2, '0') + 'h';
    });
  }

  getDayMissionPosition(mission: Mission): { left: number, width: number } {
    const startHour = parseInt(mission.heureDebut.split(':')[0]);
    const startMinute = parseInt(mission.heureDebut.split(':')[1]);
    const endHour = parseInt(mission.heureFin.split(':')[0]);
    const endMinute = parseInt(mission.heureFin.split(':')[1]);
    
    // Calculer la position par rapport à la grille 6h-22h (16 heures)
    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;
    const duration = endTime - startTime;
    
    // Position relative dans la grille (6h = 0%, 22h = 100%)
    const gridStart = 6; // 6h du matin
    const gridDuration = 16; // 16 heures (6h-22h)
    
    const leftPercent = ((startTime - gridStart) / gridDuration) * 100;
    const widthPercent = (duration / gridDuration) * 100;
    
    return {
      left: Math.max(0, leftPercent),
      width: Math.min(100 - leftPercent, widthPercent)
    };
  }

  // ===== NOUVELLES MÉTHODES POUR LES PARAMÈTRES =====

  initSettingsForm() {
    this.settingsForm = this.fb.group({
      prenom: [this.userProfile.prenom, [Validators.required]],
      nom: [this.userProfile.nom, [Validators.required]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      telephone: [this.userProfile.telephone, [Validators.required]],
      dateNaissance: ['1990-01-01'],
      adresse: ['123 Rue de la Paix, 75001 Paris']
    });
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: any) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  // ===== NOUVELLES MÉTHODES POUR LES MESSAGES =====
  loadMessages() {
    // Données de simulation - remplacez par un appel API réel
    const now = new Date();
    
    this.messages = [
      {
        id: '1',
        expediteur: 'Service Planning ALENIA',
        sujet: 'Nouvelle mission disponible - Hôpital Saint-Antoine',
        contenu: `Bonjour Jean,

Une nouvelle mission vient de se libérer :

📅 Date : 25 juin 2025
🏥 Établissement : Hôpital Saint-Antoine
⏰ Horaires : 08h00 - 16h00
💼 Service : Urgences
👨‍⚕️ Spécialité : Infirmier
💰 Rémunération : 200€

Merci de confirmer votre disponibilité dans les plus brefs délais.

Cordialement,
L'équipe Planning ALENIA`,
        dateEnvoi: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Il y a 2h
        lu: false,
        important: true,
        urgent: false,
        categorie: 'mission'
      },
      {
        id: '2',
        expediteur: 'Service RH',
        sujet: 'Mise à jour de votre profil requise',
        contenu: `Bonjour Jean,

Nous avons remarqué que certains documents de votre profil arrivent bientôt à expiration :

- Attestation de sécurité sociale (expire le 30/07/2025)
- Formation obligatoire (expire le 15/08/2025)

Merci de mettre à jour ces documents dans votre espace personnel.

Cordialement,
Service RH ALENIA`,
        dateEnvoi: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Hier
        lu: true,
        important: false,
        urgent: false,
        categorie: 'administrative'
      },
      {
        id: '3',
        expediteur: 'Dr. Martin - Hôpital Saint-Antoine',
        sujet: 'Confirmation mission du 24 juin',
        contenu: `Bonjour,

Je vous confirme votre mission de demain :
- Arrivée prévue : 08h00 précises
- Vestiaires : Niveau -1, couloir B
- Référent sur place : Infirmière Chef Mme Dubois

N'hésitez pas si vous avez des questions.

Cordialement,
Dr. Martin`,
        dateEnvoi: new Date(now.getTime() - 3 * 60 * 60 * 1000), // Il y a 3h
        lu: false,
        important: false,
        urgent: true,
        categorie: 'mission'
      },
      {
        id: '4',
        expediteur: 'Administration ALENIA',
        sujet: 'Votre feuille de paie de mai 2025',
        contenu: `Bonjour Jean,

Votre feuille de paie du mois de mai 2025 est disponible dans votre espace personnel.

Récapitulatif :
- Heures travaillées : 152h
- Rémunération brute : 3 040€
- Net à payer : 2 387€

Vous pouvez la télécharger dans la section "Documents".

Cordialement,
Service Paie ALENIA`,
        dateEnvoi: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
        lu: true,
        important: false,
        urgent: false,
        categorie: 'administrative',
        pieceJointe: 'feuille_paie_mai_2025.pdf'
      },
      {
        id: '5',
        expediteur: 'Support Technique',
        sujet: 'Maintenance programmée de la plateforme',
        contenu: `Cher utilisateur,

Une maintenance est programmée sur notre plateforme :

📅 Date : Dimanche 30 juin 2025
⏰ Horaires : 02h00 - 06h00
⚠️ Impact : Indisponibilité temporaire de l'application

Nous nous excusons pour la gêne occasionnée.

L'équipe technique`,
        dateEnvoi: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // Il y a 4 jours
        lu: true,
        important: false,
        urgent: false,
        categorie: 'technique'
      }
    ];
    
    this.filteredMessages = [...this.messages];
  }

  // Filtres et recherche
  setMessageFilter(filter: 'tous' | 'non_lus' | 'importants') {
    this.messageFilter = filter;
    this.filterMessages();
  }

  filterMessages() {
    let filtered = [...this.messages];
    
    // Filtrer par statut
    switch (this.messageFilter) {
      case 'non_lus':
        filtered = filtered.filter(msg => !msg.lu);
        break;
      case 'importants':
        filtered = filtered.filter(msg => msg.important);
        break;
      // 'tous' ne filtre rien
    }
    
    // Filtrer par recherche
    if (this.messageSearchTerm.trim()) {
      const searchTerm = this.messageSearchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.sujet.toLowerCase().includes(searchTerm) ||
        msg.expediteur.toLowerCase().includes(searchTerm) ||
        msg.contenu.toLowerCase().includes(searchTerm)
      );
    }
    
    // Trier par date (plus récent en premier)
    filtered.sort((a, b) => new Date(b.dateEnvoi).getTime() - new Date(a.dateEnvoi).getTime());
    
    this.filteredMessages = filtered;
  }

  // Statistiques
  getTotalMessages(): number {
    return this.messages.length;
  }

  getUnreadMessages(): number {
    return this.messages.filter(msg => !msg.lu).length;
  }

  getImportantMessages(): number {
    return this.messages.filter(msg => msg.important).length;
  }

  getWeekMessages(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.messages.filter(msg => 
      new Date(msg.dateEnvoi) >= oneWeekAgo
    ).length;
  }

  // Interface utilisateur
  getFilterTitle(): string {
    switch (this.messageFilter) {
      case 'tous': return 'Tous les messages';
      case 'non_lus': return 'Messages non lus';
      case 'importants': return 'Messages importants';
      default: return 'Messages';
    }
  }

  getFilteredMessages(): Message[] {
    return this.filteredMessages;
  }

  getEmptyStateMessage(): string {
    if (this.messageSearchTerm.trim()) {
      return 'Aucun message ne correspond à votre recherche';
    }
    
    switch (this.messageFilter) {
      case 'non_lus': return 'Tous vos messages sont lus !';
      case 'importants': return 'Aucun message important pour le moment';
      default: return 'Votre boîte de réception est vide';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getMessageCategoryClass(categorie: string): string {
    const classes = {
      'mission': 'bg-blue-100 text-blue-800',
      'administrative': 'bg-green-100 text-green-800',
      'planning': 'bg-purple-100 text-purple-800',
      'generale': 'bg-gray-100 text-gray-800',
      'technique': 'bg-orange-100 text-orange-800'
    };
    return classes[categorie as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getMessageCategoryLabel(categorie: string): string {
    const labels = {
      'mission': 'Mission',
      'administrative': 'Administratif',
      'planning': 'Planning',
      'generale': 'Général',
      'technique': 'Technique'
    };
    return labels[categorie as keyof typeof labels] || categorie;
  }

  // Actions sur les messages
  openMessage(message: Message) {
    this.selectedMessage = message;
    if (!message.lu) {
      this.markAsRead(message);
    }
  }

  closeMessage() {
    this.selectedMessage = null;
  }

  toggleRead(message: Message) {
    message.lu = !message.lu;
    this.filterMessages(); // Mettre à jour la liste filtrée
  }

  markAsRead(message: Message) {
    message.lu = true;
    this.filterMessages();
  }

  toggleImportant(message: Message) {
    message.important = !message.important;
    this.filterMessages();
  }

  deleteMessage(message: Message) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le message "${message.sujet}" ?`)) {
      this.messages = this.messages.filter(msg => msg.id !== message.id);
      this.filterMessages();
      
      if (this.selectedMessage?.id === message.id) {
        this.closeMessage();
      }
      
      alert('Message supprimé avec succès !');
    }
  }

  // Nouveau message
  openNewMessageModal() {
    this.showNewMessageModal = true;
    this.newMessageForm.reset();
  }

  closeNewMessageModal() {
    this.showNewMessageModal = false;
    this.newMessageForm.reset();
  }

  sendMessage() {
    if (!this.newMessageForm.valid) {
      this.newMessageForm.markAllAsTouched();
      return;
    }

    const formValue = this.newMessageForm.value;
    
    // Simuler l'envoi du message
    console.log('Envoi du message:', formValue);
    
    // Ici vous feriez un appel API
    alert(`Message envoyé à ${formValue.destinataire} !`);
    
    this.closeNewMessageModal();
  }

  replyToMessage(message: Message) {
    this.openNewMessageModal();
    
    // Pré-remplir le formulaire avec les données de réponse
    this.newMessageForm.patchValue({
      destinataire: this.getReplyRecipient(message.expediteur),
      sujet: `Re: ${message.sujet}`,
      contenu: `\n\n--- Message original ---\nDe: ${message.expediteur}\nDate: ${message.dateEnvoi}\nSujet: ${message.sujet}\n\n${message.contenu}`,
      urgent: false
    });
    
    this.closeMessage();
  }

  private getReplyRecipient(expediteur: string): string {
    // Mapper les expéditeurs vers les destinataires appropriés
    if (expediteur.includes('Planning')) return 'planning';
    if (expediteur.includes('RH')) return 'rh';
    if (expediteur.includes('Support')) return 'support';
    if (expediteur.includes('Administration')) return 'admin';
    return 'admin'; // Par défaut
  }

  // ===== MÉTHODES POUR LES PARAMÈTRES =====

  setParameterSection(section: 'compte' | 'notifications' | 'preferences' | 'securite' | 'support') {
    this.parameterSection = section;
  }

  saveAccountSettings() {
    if (this.settingsForm.valid) {
      const formData = this.settingsForm.value;
      
      this.userProfile = {
        ...this.userProfile,
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone
      };

      console.log('Paramètres sauvegardés:', formData);
      alert('Paramètres sauvegardés avec succès !');
    }
  }

  resetAccountSettings() {
    this.settingsForm.patchValue({
      prenom: this.userProfile.prenom,
      nom: this.userProfile.nom,
      email: this.userProfile.email,
      telephone: this.userProfile.telephone
    });
  }

  updateNotificationSetting(type: 'email' | 'sms' | 'push', setting: string, event: any) {
    const isChecked = event.target.checked;
    
    if (type === 'email') {
      (this.notificationSettings.email as any)[setting] = isChecked;
    } else if (type === 'sms') {
      (this.notificationSettings.sms as any)[setting] = isChecked;
    } else if (type === 'push') {
      (this.notificationSettings.push as any)[setting] = isChecked;
    }

    this.saveNotificationSettings();
  }

  saveNotificationSettings() {
    console.log('Notifications sauvegardées:', this.notificationSettings);
  }

  toggleZonePreference(zoneId: string, event: any) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      if (!this.workPreferences.zones.includes(zoneId)) {
        this.workPreferences.zones.push(zoneId);
      }
    } else {
      this.workPreferences.zones = this.workPreferences.zones.filter(id => id !== zoneId);
    }
  }

  toggleEtablissementPreference(typeId: string, event: any) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      if (!this.workPreferences.etablissements.includes(typeId)) {
        this.workPreferences.etablissements.push(typeId);
      }
    } else {
      this.workPreferences.etablissements = this.workPreferences.etablissements.filter(id => id !== typeId);
    }
  }

  saveWorkPreferences() {
    console.log('Préférences sauvegardées:', this.workPreferences);
    alert('Préférences de travail sauvegardées !');
  }

  resetWorkPreferences() {
    this.workPreferences = {
      zones: ['paris'],
      etablissements: ['hopital'],
      heureDebutMin: '06:00',
      heureFinMax: '22:00',
      distanceMax: 30
    };
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const formData = this.passwordForm.value;
      
      console.log('Changement de mot de passe demandé');
      alert('Mot de passe modifié avec succès !');
      
      this.resetPasswordForm();
    }
  }

  resetPasswordForm() {
    this.passwordForm.reset();
  }

  toggleTwoFactor(event: any) {
    const isEnabled = event.target.checked;
    this.securitySettings.twoFactor.enabled = isEnabled;
    
    if (isEnabled) {
      alert('Configuration de l\'authentification à deux facteurs...');
    } else {
      if (confirm('Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ?')) {
        alert('Authentification à deux facteurs désactivée.');
      } else {
        event.target.checked = true;
        this.securitySettings.twoFactor.enabled = true;
      }
    }
  }

  getDeviceIcon(device: string): string {
    if (device.includes('iPhone') || device.includes('Safari')) return '📱';
    if (device.includes('Android')) return '📱';
    if (device.includes('Chrome')) return '💻';
    if (device.includes('Firefox')) return '💻';
    return '🖥️';
  }

  revokeSession(session: ActiveSession) {
    if (confirm(`Êtes-vous sûr de vouloir révoquer la session "${session.device}" ?`)) {
      this.activeSessions = this.activeSessions.filter(s => s.id !== session.id);
      alert('Session révoquée avec succès !');
    }
  }

  toggleFaq(faq: FaqItem) {
    faq.open = !faq.open;
    
    this.faqItems.forEach(item => {
      if (item !== faq) {
        item.open = false;
      }
    });
  }
  // ===== CHARGEMENT DYNAMIQUE DU PROFIL UTILISATEUR =====
  loadUserProfileFromAuth() {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      console.log('Données utilisateur depuis getCurrentUser():', currentUser);
      
      // Utiliser les données disponibles dans l'objet utilisateur
      this.userProfile.email = currentUser.email || '';
      this.userProfile.prenom = currentUser.prenom || '';
      this.userProfile.nom = currentUser.nom || '';
      this.userProfile.telephone = ''; // Pas disponible dans le token
      this.userProfile.specialite = 'ASH'; // Valeur par défaut
      this.userProfile.experience = 2; // Valeur par défaut
      
      console.log('Profil utilisateur chargé dynamiquement:', this.userProfile);
      
      // Si on n'a pas le prénom/nom, essayer de récupérer les détails complets
      if (!this.userProfile.prenom || !this.userProfile.nom) {
        console.log('Prénom/nom manquants, tentative de récupération via API...');
        this.loadCompleteUserProfile(currentUser.id);
      }
    } else {
      console.log('Aucun utilisateur connecté, redirection vers la connexion...');
      this.router.navigate(['/connexion']);
    }
  }

  // Méthode pour charger le profil complet depuis l'API
  loadCompleteUserProfile(userId: string) {
    if (this.interimaireService && userId) {
      this.interimaireService.getInterimaire(userId).subscribe({
        next: (interimaire) => {
          console.log('Profil complet récupéré depuis l\'API:', interimaire);
          
          // Mettre à jour avec les vraies données
          this.userProfile.prenom = interimaire.prenom || this.userProfile.prenom;
          this.userProfile.nom = interimaire.nom || this.userProfile.nom;
          this.userProfile.telephone = interimaire.telephone || '';
          this.userProfile.specialite = interimaire.competences?.[0] || 'ASH';
          
          // Réinitialiser le formulaire avec les nouvelles données
          if (this.profileForm) {
            this.initProfileForm();
          }
          
          console.log('Profil utilisateur final:', this.userProfile);
        },
        error: (error) => {
          console.error('Erreur lors du chargement du profil complet:', error);
          // Garder les données partielles du token
        }
      });
    }
  }
}
