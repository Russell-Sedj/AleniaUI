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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Écouter les événements de navigation pour mettre à jour currentUrl
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }  // ✅ Méthode pour détecter les routes dashboard (sans navbar)
  isDashboardRoute(): boolean {
    const dashboardRoutes = [
      '/dashboard-interimaire',
      '/dashboard-etablissement',
      '/missions',
      '/missions-passes',
      '/missions-venir',
      '/missions-disponibles',
      '/profil1',
      '/profil2',
      '/profil3',
      '/disponibilite',
      '/prestation',
      '/fiche-poste',
      '/contrat',
      '/parametre-entreprise',
      '/planning-entreprise'
    ];
    return dashboardRoutes.some((route) => this.currentUrl.includes(route));
  }

  // ✅ Méthode pour détecter les routes publiques (avec navbar)
  isPublicRoute(): boolean {
    const publicRoutes = [
      '/page-accueil',
      '/ce-que-lon-propose',
      '/qui-sommes-nous',
      '/connexion',
      '/inscription'
    ];
    
    return (
      publicRoutes.some((route) => this.currentUrl.includes(route)) ||
      this.currentUrl === '/'
    );
  }
}
