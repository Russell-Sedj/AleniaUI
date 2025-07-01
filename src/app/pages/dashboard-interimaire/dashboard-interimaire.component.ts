import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { InterimaireService } from '../../services/interimaire/intermaire.service';
import { MissionService, MissionDto } from '../../services/mission/mission.service';
import { CandidatureService, CandidatureDto } from '../../services/candidature/candidature.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { CheckboxFieldComponent } from '../../components/checkbox/checkbox-field.component';
import { CheckboxGroupComponent } from '../../components/checkbox/checkbox-group.component';
import { FieldsetComponent } from '../../components/fieldset/fieldset.component';
import { LegendComponent } from '../../components/fieldset/legend.component';
import { LabelComponent } from '../../components/fieldset/label.component';
import { DescriptionComponent } from '../../components/fieldset/description.component';
import { TextComponent } from '../../components/text/text.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { 
  SidebarComponent,
  NavigationItem,
  UserProfile
} from '../../components/sidebar';

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
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, AvatarComponent, CheckboxComponent, CheckboxFieldComponent, CheckboxGroupComponent, FieldsetComponent, LegendComponent, LabelComponent, DescriptionComponent, TextComponent, SidebarComponent, NotificationComponent, ConfirmationModalComponent],
  templateUrl: './dashboard-interimaire.component.html',
  styleUrl: './dashboard-interimaire.component.css',
})
export class DashboardInterimaireComponent implements OnInit {
  // Propriétés pour la sidebar
  navigationItems: NavigationItem[] = [
    {
      id: 'profil',
      label: 'Mon Profil',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
    },
    {
      id: 'missions',
      label: 'Mes Missions',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2"></path></svg>'
    },
    {
      id: 'planning',
      label: 'Planning',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>'
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
    }
  ];
  sidebarUserProfile: UserProfile = {
    name: 'Utilisateur',
    email: 'utilisateur@alenia.fr',
    initials: 'U'
  };

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
  faqItems: FaqItem[] = [];  userProfile = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    specialite: '',
    experience: 0,
    dateNaissance: '',
    adresse: ''
  };

  // Email support (pour éviter les problèmes avec @)
  supportEmail = 'support@alenia.fr';
  // Méthode pour générer les initiales de l'utilisateur
  getUserInitials(): string {
    const prenom = this.userProfile.prenom || '';
    const nom = this.userProfile.nom || '';
    
    // Si on n'a pas de prénom et nom, retourner une valeur par défaut
    if (!prenom && !nom) {
      return 'U';
    }
    
    const prenomInitial = prenom.charAt(0).toUpperCase();
    const nomInitial = nom.charAt(0).toUpperCase();
    
    return `${prenomInitial}${nomInitial}`;
  }

  // Méthodes pour la sidebar
  updateSidebarProfile() {
    this.sidebarUserProfile = {
      name: `${this.userProfile.prenom} ${this.userProfile.nom}`,
      email: this.userProfile.email,
      initials: this.getUserInitials()
    };
  }

  onSidebarItemClick(item: NavigationItem) {
    this.setActiveSection(item.id);
  }

  onSidebarLogout() {
    this.logout();
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private interimaireService: InterimaireService,
    private missionService: MissionService,
    private candidatureService: CandidatureService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {
    this.currentDate = new Date();
  }

  getCurrentFrenchDate(): Date {
    return new Date();
  }  ngOnInit() {
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
      specialite: [this.userProfile.specialite], // Pas obligatoire initialement
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
      this.notificationService.success('Profil mis à jour avec succès !');
    } else {
      this.profileForm.markAllAsTouched();
    }
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
        this.notificationService.error('Le fichier est trop volumineux. Taille maximum : 10MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'image/jpeg', 'image/png', 'image/jpg'];
      
      if (!allowedTypes.includes(file.type)) {
        this.notificationService.error('Type de fichier non autorisé. Utilisez : PDF, DOC, DOCX, JPG, PNG');
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
    this.notificationService.success(`Document "${newDocument.nom}" ajouté avec succès !`);
  }

  async replaceDocument(type: string) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Remplacer le document',
      message: 'Êtes-vous sûr de vouloir remplacer ce document ?',
      confirmText: 'Remplacer',
      cancelText: 'Annuler',
      type: 'warning'
    });
    
    if (confirmed) {
      this.openUploadModal(type);
    }
  }

  viewDocument(document: Document | undefined) {
    if (!document) return;
    this.notificationService.info(`Ouverture du document : ${document.nom}`);
  }

  downloadDocument(document: Document | undefined) {
    if (!document) return;
    this.notificationService.info(`Téléchargement du document : ${document.nom}`);
  }

  async deleteDocument(document: Document) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer le document',
      message: `Êtes-vous sûr de vouloir supprimer "${document.nom}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    
    if (confirmed) {
      this.documents = this.documents.filter(doc => doc.id !== document.id);
      this.filteredDocuments = [...this.documents];
      this.notificationService.success('Document supprimé avec succès !');
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
    // Récupérer l'utilisateur connecté
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.error('Aucun utilisateur connecté');
      this.missions = [];
      return;
    }

    console.log('Chargement des missions pour l\'intérimaire:', currentUser.id);

    // Charger les candidatures acceptées de l'intérimaire
    this.candidatureService.getCandidaturesByInterimaire(currentUser.id).subscribe({
      next: (candidatures: CandidatureDto[]) => {
        console.log('Candidatures de l\'intérimaire:', candidatures);

        // Filtrer les candidatures acceptées
        const candidaturesAcceptees = candidatures.filter(c => c.statut === 'Acceptée');
        console.log('Candidatures acceptées:', candidaturesAcceptees);

        if (candidaturesAcceptees.length === 0) {
          this.missions = [];
          console.log('Aucune mission acceptée trouvée');
          return;
        }

        // Récupérer les détails des missions pour les candidatures acceptées
        const missionIds = candidaturesAcceptees.map(c => c.missionId);
        this.loadMissionDetails(missionIds, candidaturesAcceptees);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidatures:', error);
        this.missions = [];
      }
    });
  }

  private loadMissionDetails(missionIds: string[], candidatures: CandidatureDto[]) {
    // Charger toutes les missions depuis l'API
    this.missionService.getAllMissions().subscribe({
      next: (allMissions: MissionDto[]) => {
        console.log('Toutes les missions:', allMissions);

        // Filtrer les missions qui correspondent aux candidatures acceptées et qui sont planifiées
        const missionsAcceptees = allMissions.filter(mission => 
          missionIds.includes(mission.id) && mission.estPlanifiee && mission.dateMission
        );

        console.log('Missions acceptées et planifiées:', missionsAcceptees);

        // Convertir au format attendu par le template
        this.missions = missionsAcceptees.map(mission => {
          const candidature = candidatures.find(c => c.missionId === mission.id);
          return {
            id: mission.id,
            etablissement: mission.etablissementNom || 'Établissement',
            service: '', // Pas disponible dans le DTO, sera masqué dans le template si vide
            specialite: mission.poste,
            dateMission: new Date(mission.dateMission!),
            heureDebut: mission.heureDebut || '08:00',
            heureFin: mission.heureFin || '16:00',
            duree: mission.dureeHeures || 8,
            statut: 'confirmee' as const,
            adresse: mission.adresse,
            contact: mission.etablissementTelephone || 'Non disponible',
            remuneration: mission.tauxHoraire * (mission.dureeHeures || 8)
          };
        });

        console.log('Missions formatées pour l\'intérimaire:', this.missions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails des missions:', error);
        this.missions = [];
      }
    });
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
    return Array.from({ length: 18 }, (_, i) => i + 5); // De 5h à 22h (5+18-1=22)
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

  // Méthode pour gérer les missions qui commencent avant 5h ou finissent après 23h
  isDayMissionVisible(mission: Mission): boolean {
    const startHour = parseInt(mission.heureDebut.split(':')[0]);
    const endHour = parseInt(mission.heureFin.split(':')[0]);
    
    // Afficher la mission si elle a au moins une partie dans la plage 5h-23h
    return !(endHour <= 5 || startHour >= 23);
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

  // Nouvelle méthode pour la vue semaine avec positionnement des missions
  getWeekMissionPosition(mission: Mission): { top: number, height: number } {
    const startHour = parseInt(mission.heureDebut.split(':')[0]);
    const startMinute = parseInt(mission.heureDebut.split(':')[1]);
    const endHour = parseInt(mission.heureFin.split(':')[0]);
    const endMinute = parseInt(mission.heureFin.split(':')[1]);
    
    // Calculer la position par rapport à la grille des heures de travail (5h-22h)
    const gridStart = 5; // 5h du matin
    const hourHeight = 60; // 60px par heure
    
    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;
    const duration = endTime - startTime;
    
    const topPosition = (startTime - gridStart) * hourHeight;
    const height = duration * hourHeight - 2; // -2px pour laisser un petit espace
    
    return {
      top: Math.max(0, topPosition),
      height: Math.max(20, height) // Hauteur minimum de 20px
    };
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
    // Afficher de 5h à 22h pour la vue jour
    return Array.from({ length: 18 }, (_, i) => {
      const hour = i + 5;
      return hour.toString().padStart(2, '0') + 'h';
    });
  }

  getDayMissionPosition(mission: Mission): { left: number, width: number } {
    const startHour = parseInt(mission.heureDebut.split(':')[0]);
    const startMinute = parseInt(mission.heureDebut.split(':')[1]);
    const endHour = parseInt(mission.heureFin.split(':')[0]);
    const endMinute = parseInt(mission.heureFin.split(':')[1]);
    
    // Calculer la position par rapport à la grille 5h-22h (18 heures)
    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;
    const duration = endTime - startTime;
    
    // Position relative dans la grille (5h = 0%, 22h = 100%)
    const gridStart = 5; // 5h du matin
    const gridDuration = 18; // 18 heures (5h-22h + 1)
    
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
      prenom: [this.userProfile.prenom, [Validators.required, Validators.minLength(2)]],
      nom: [this.userProfile.nom, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      telephone: [this.userProfile.telephone, [Validators.required]],
      dateNaissance: [this.userProfile.dateNaissance], // Pas obligatoire mais recommandé
      adresse: [this.userProfile.adresse] // Pas obligatoire mais recommandé
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

  async deleteMessage(message: Message) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer le message',
      message: `Êtes-vous sûr de vouloir supprimer le message "${message.sujet}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    
    if (confirmed) {
      this.messages = this.messages.filter(msg => msg.id !== message.id);
      this.filterMessages();
      
      if (this.selectedMessage?.id === message.id) {
        this.closeMessage();
      }
      
      this.notificationService.success('Message supprimé avec succès !');
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
    this.notificationService.success(`Message envoyé à ${formValue.destinataire} !`);
    
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
  async saveAccountSettings() {
    if (this.settingsForm.valid) {
      // Mettre à jour le profil utilisateur avec les nouvelles données
      this.userProfile = {
        ...this.userProfile,
        ...this.settingsForm.value
      };

      // Mettre à jour aussi le formulaire principal du profil
      this.profileForm.patchValue(this.userProfile);
      
      // Mettre à jour le profil de la sidebar
      this.updateSidebarProfile();

      console.log('Paramètres du compte mis à jour:', this.userProfile);
      this.notificationService.success('Paramètres du compte mis à jour avec succès !');
    } else {
      this.settingsForm.markAllAsTouched();
      this.notificationService.warning('Veuillez corriger les erreurs dans le formulaire.');
    }
  }

  resetAccountSettings() {
    this.settingsForm.patchValue({
      prenom: this.userProfile.prenom,
      nom: this.userProfile.nom,
      email: this.userProfile.email,
      telephone: this.userProfile.telephone,
      dateNaissance: this.userProfile.dateNaissance,
      adresse: this.userProfile.adresse
    });
    this.notificationService.info('Paramètres réinitialisés.');
  }

  // Méthode pour vérifier si les paramètres essentiels sont complets
  isProfileComplete(): boolean {
    return !!(this.userProfile.dateNaissance && this.userProfile.adresse && this.userProfile.specialite);
  }

  // Méthode pour obtenir les champs manquants
  getMissingFields(): string[] {
    const missing: string[] = [];
    if (!this.userProfile.dateNaissance) missing.push('date de naissance');
    if (!this.userProfile.adresse) missing.push('adresse');
    if (!this.userProfile.specialite) missing.push('spécialité');
    return missing;
  }

  // Méthode pour formater la liste des champs manquants
  getMissingFieldsText(): string {
    const missing = this.getMissingFields();
    if (missing.length === 0) return '';
    if (missing.length === 1) return missing[0];
    if (missing.length === 2) return missing.join(' et ');
    return missing.slice(0, -1).join(', ') + ' et ' + missing[missing.length - 1];
  }

  // Méthode pour naviguer vers les paramètres du compte
  goToAccountSettings() {
    this.setActiveSection('parametres');
    this.setParameterSection('compte');
  }

  // Méthodes pour les autres sections des paramètres
  updateNotificationSetting(type: 'email' | 'sms' | 'push', setting: string, event: any) {
    const isChecked = event.target.checked;
    (this.notificationSettings[type] as any)[setting] = isChecked;
    console.log(`Notification ${type}.${setting} mise à jour:`, isChecked);
    this.notificationService.info(`Préférences de notification mises à jour.`);
  }

  async changePassword() {
    if (this.passwordForm.valid) {
      const confirmed = await this.confirmationService.confirm({
        title: 'Changer le mot de passe',
        message: 'Êtes-vous sûr de vouloir changer votre mot de passe ?',
        confirmText: 'Changer',
        cancelText: 'Annuler',
        type: 'warning'
      });
      
      if (confirmed) {
        console.log('Changement de mot de passe:', this.passwordForm.value);
        this.passwordForm.reset();
        this.notificationService.success('Mot de passe changé avec succès !');
      }
    } else {
      this.passwordForm.markAllAsTouched();
      this.notificationService.warning('Veuillez corriger les erreurs dans le formulaire.');
    }
  }

  async deleteAccount() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer le compte',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });
    
    if (confirmed) {
      // Ici, implémentez la logique de suppression du compte
      this.notificationService.error('Fonctionnalité de suppression en cours d\'implémentation.');
    }
  }

  // Note: La méthode getInitials existe déjà plus haut dans le fichier

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
      this.userProfile.specialite = ''; // Initialement vide, sera rempli si disponible
      this.userProfile.experience = 0; // Initialement 0
        console.log('Profil utilisateur chargé dynamiquement:', this.userProfile);
        // Mettre à jour le profil de la sidebar après chargement des données
      this.updateSidebarProfile();
      
      // Mettre à jour le formulaire des paramètres
      this.updateSettingsForm();
      
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
          this.userProfile.specialite = interimaire.competences?.[0] || ''; // Garder vide si pas de compétences
            // Réinitialiser le formulaire avec les nouvelles données
          if (this.profileForm) {
            this.initProfileForm();
          }
            // Mettre à jour le profil de la sidebar avec les nouvelles données
          this.updateSidebarProfile();
          
          // Mettre à jour le formulaire des paramètres
          this.updateSettingsForm();
          
          console.log('Profil utilisateur final:', this.userProfile);
        },
        error: (error) => {
          console.error('Erreur lors du chargement du profil complet:', error);
          // Garder les données partielles du token
        }
      });
    }
  }

  // Méthode pour mettre à jour le formulaire des paramètres avec les données utilisateur
  updateSettingsForm() {
    if (this.settingsForm) {
      this.settingsForm.patchValue({
        prenom: this.userProfile.prenom,
        nom: this.userProfile.nom,
        email: this.userProfile.email,
        telephone: this.userProfile.telephone,
        dateNaissance: this.userProfile.dateNaissance,
        adresse: this.userProfile.adresse
      });
    }
  }

  // Méthodes supplémentaires pour les paramètres
  toggleZonePreference(zoneId: string, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.workPreferences.zones.includes(zoneId)) {
        this.workPreferences.zones.push(zoneId);
      }
    } else {
      this.workPreferences.zones = this.workPreferences.zones.filter(id => id !== zoneId);
    }
    console.log('Zones préférées mises à jour:', this.workPreferences.zones);
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
    console.log('Types d\'établissement préférés mis à jour:', this.workPreferences.etablissements);
  }

  saveWorkPreferences() {
    console.log('Préférences de travail sauvegardées:', this.workPreferences);
    this.notificationService.success('Préférences de travail mises à jour !');
  }

  resetWorkPreferences() {
    this.workPreferences = {
      zones: ['paris', 'hautsdeseine'],
      etablissements: ['hopital', 'clinique'],
      heureDebutMin: '06:00',
      heureFinMax: '22:00',
      distanceMax: 30
    };
    this.notificationService.info('Préférences réinitialisées.');
  }

  resetPasswordForm() {
    this.passwordForm.reset();
    this.notificationService.info('Formulaire réinitialisé.');
  }

  toggleTwoFactor(event: any) {
    this.securitySettings.twoFactor.enabled = event.target.checked;
    console.log('Authentification à deux facteurs:', this.securitySettings.twoFactor.enabled);
    this.notificationService.info(
      this.securitySettings.twoFactor.enabled ? 
      'Authentification à deux facteurs activée.' : 
      'Authentification à deux facteurs désactivée.'
    );
  }

  getDeviceIcon(device: string): string {
    if (device.toLowerCase().includes('chrome')) return '🖥️';
    if (device.toLowerCase().includes('safari')) return '📱';
    if (device.toLowerCase().includes('firefox')) return '🦊';
    if (device.toLowerCase().includes('edge')) return '🔷';
    return '💻';
  }

  async revokeSession(session: ActiveSession) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Révoquer la session',
      message: `Êtes-vous sûr de vouloir révoquer la session "${session.device}" ?`,
      confirmText: 'Révoquer',
      cancelText: 'Annuler',
      type: 'warning'
    });
    
    if (confirmed) {
      this.activeSessions = this.activeSessions.filter(s => s.id !== session.id);
      this.notificationService.success('Session révoquée avec succès.');
    }
  }

  toggleFaq(faq: FaqItem) {
    faq.open = !faq.open;
  }

  // Note: La méthode getInitials existe déjà plus haut dans le fichier
}
