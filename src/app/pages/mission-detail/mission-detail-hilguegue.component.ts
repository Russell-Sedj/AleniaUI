import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CandidatureService, CreateCandidatureDto } from '../../services/candidature/candidature.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission-detail-hilguegue',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './mission-detail-hilguegue.component.html',
})
export class MissionDetailHilguegueComponent implements OnInit {
  missionId: string = '08dd4c14-157a-4a57-83d1-bfa9f00335dc'; // Default mission ID for demo
  
  constructor(
    private candidatureService: CandidatureService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
    ngOnInit() {
    // Get the mission ID from route parameters if available
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.missionId = params['id'];
      }
    });
  }

  deconnecter() {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }postulerMission() {
    // Get current user ID
    const user = this.authService.getCurrentUser();
    
    console.log('=== DEBUG POSTULATION ===');
    console.log('User récupéré:', user);
    console.log('localStorage currentUser:', localStorage.getItem('currentUser'));
    console.log('localStorage authToken:', localStorage.getItem('authToken'));
    
    if (!user || !user.id) {
      console.log('User non connecté ou pas d\'ID');
      alert('Vous devez être connecté en tant qu\'intérimaire pour postuler à une mission');
      this.router.navigate(['/connexion']);
      return;
    }
    
    // Vérifier si l'utilisateur est un intérimaire
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      if (userObj.type === 'etablissement') {
        console.log('Utilisateur est un établissement, ne peut pas postuler');
        alert('Seuls les intérimaires peuvent postuler à des missions. Veuillez vous connecter avec un compte intérimaire.');
        this.router.navigate(['/connexion']);
        return;
      }
    }
    
    console.log('Mission ID:', this.missionId);
    console.log('User ID:', user.id, 'Type:', typeof user.id);
    
    // Vérifier que les IDs sont des GUIDs valides
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!guidRegex.test(this.missionId)) {
      console.log('Mission ID invalid:', this.missionId);
      alert('ID de mission invalide');
      return;
    }
    
    if (!guidRegex.test(user.id)) {
      console.log('User ID invalid:', user.id);
      alert('ID d\'utilisateur invalide. Veuillez vous reconnecter avec un compte intérimaire valide.');
      this.router.navigate(['/connexion']);
      return;
    }
    
    const candidature: CreateCandidatureDto = {
      missionId: this.missionId,
      interimaireId: user.id,
      horairesChoisis: [] // Default empty array, could be populated from form
    };
    
    console.log('Candidature à envoyer:', candidature);
    
    this.candidatureService.createCandidature(candidature).subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response);
        alert('Votre candidature a été envoyée avec succès!');
        this.router.navigate(['/dashboard-interimaire']);
      },
      error: (error) => {
        console.error('Erreur complète:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Body:', error.error);
        
        let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre candidature.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Données de candidature invalides ou vous avez déjà candidaté pour cette mission.';
        } else if (error.status === 401) {
          errorMessage = 'Vous devez être connecté pour postuler.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
        
        alert(errorMessage);
      }
    });
  }
}
