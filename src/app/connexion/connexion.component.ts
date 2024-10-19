import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './connexion.component.html',
  // styleUrl: './connexion.component.css'
  styleUrls: [
    '../../../public/assets/Css/styles.css',
    '../../../public/assets/Css/footer.css',
    '../../../public/assets/Css/navigation_barre.css',
  ],
})
export class ConnexionComponent {}
