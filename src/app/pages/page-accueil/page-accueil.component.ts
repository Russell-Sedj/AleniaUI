import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.css']
})
export class PageAccueilComponent {
  heroImage = '/assets/images/image17.png';
  compImage = '/assets/images/comp1.png';

  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/inscription']);
  }
}