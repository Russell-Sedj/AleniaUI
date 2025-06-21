import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-du-site',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './plan-du-site.component.html',
  styleUrl: './plan-du-site.component.css'
})
export class PlanDuSiteComponent {
  currentYear = new Date().getFullYear();
}
