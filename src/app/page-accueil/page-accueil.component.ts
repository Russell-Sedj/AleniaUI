import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-accueil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-accueil.component.html',
  // styleUrl: './page-accueil.component.css',
  // styleUrls: ['./page-accueil.component.css'],
  styleUrls: ['../../../public/assets/Css/style.css'],
})
export class PageAccueilComponent {}
