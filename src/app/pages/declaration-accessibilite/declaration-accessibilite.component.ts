import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-declaration-accessibilite',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './declaration-accessibilite.component.html',
  styleUrl: './declaration-accessibilite.component.css'
})
export class DeclarationAccessibiliteComponent {
  currentYear = new Date().getFullYear();
}
