import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: [
    '../../public/assets/Css/styles.css',
    '../../public/assets/Css/style3.css',
    '../../public/assets/Css/style4.css',
    '../../public/assets/Css/ProfilCss.css',
    '../../public/assets/Css/navigation_barre.css',
    '../../public/assets/Css/footer.css',
    './app.component.css',
  ],
})
export class AppComponent implements OnInit {
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
