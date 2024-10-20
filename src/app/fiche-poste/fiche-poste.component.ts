import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-fiche-poste',
  standalone: true,
  imports: [],
  templateUrl: './fiche-poste.component.html',
  styleUrls: ['../../../public/assets/Css/SendToBDD.css'],
})
export class FichePosteComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('createBtn')?.addEventListener('click', () => {
        const jobPosts = document.getElementById('jobPosts');

        // Créer un nouvel élément div pour l'annonce
        const newPost = document.createElement('div');
        newPost.className = 'jobPost';

        // Ajouter des détails à l'annonce
        newPost.innerHTML = `
          <h2>Nouvelle annonce</h2>
          <div class="form-group">
            <input type="text" class="jobTitle" placeholder="Nom de la fiche">
          </div>
          <div class="form-group">
            <input type="text" class="jobName" placeholder="Intitulé du poste">
          </div>
          <div class="form-group">
            <textarea class="jobTasks" placeholder="Tâches"></textarea>
          </div>
          <div class="form-group">
            <input type="file" class="jobImage" accept="image/*">
          </div>
          <div class="form-group">
            <button class="deleteBtn">Supprimer</button>
            <button class="applyBtn">Publier</button>
          </div>
        `;

        // Ajouter l'annonce à la page
        jobPosts?.appendChild(newPost);

        // Ajouter un écouteur d'événements au bouton Supprimer
        newPost.querySelector('.deleteBtn')?.addEventListener('click', () => {
          jobPosts?.removeChild(newPost);
        });

        // Ajouter un écouteur d'événements au bouton Postuler
        newPost.querySelector('.applyBtn')?.addEventListener('click', () => {
          const jobTitle = (
            newPost.querySelector('.jobTitle') as HTMLInputElement
          ).value;
          const jobName = (
            newPost.querySelector('.jobName') as HTMLInputElement
          ).value;
          const jobTasks = (
            newPost.querySelector('.jobTasks') as HTMLTextAreaElement
          ).value;
          const jobImage = (
            newPost.querySelector('.jobImage') as HTMLInputElement
          ).files?.length;

          if (!jobTitle || !jobName || !jobTasks || !jobImage) {
            alert('Veuillez remplir toutes les cases avant de postuler.');
          } else {
            alert(
              'Félicitations ! Votre candidature a été soumise avec succès.'
            );
          }
        });
      });
    }
  }
}
