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
  styleUrls: ['./app.component.css'],
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

  // Méthode pour détecter si on est sur une page de dashboard
  isDashboardRoute(): boolean {
    return this.currentUrl.includes('/dashboard-interimaire') || 
           this.currentUrl.includes('/dashboard-etablissement');
  }
}
