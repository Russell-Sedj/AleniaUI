import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  heroImage = '/assets/images/image17.png';
  compImage = '/assets/images/comp1.png';

  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/inscription']);
  }
}