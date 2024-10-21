import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    '../../public/assets/Css/styles.css',
    '../../public/assets/Css/style3.css',
    '../../public/assets/Css/style4.css',
    '../../public/assets/Css/ProfilCss.css',
  ],
})
export class AppComponent implements OnInit {
  title = 'essai';
  currentUrl: string = ''; // Initialisation de currentUrl avec une chaîne vide

  constructor(private router: Router) {}

  ngOnInit() {
    // Écouter les événements de navigation pour mettre à jour currentUrl
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }
}
