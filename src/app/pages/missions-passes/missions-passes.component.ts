import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-missions-passes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './missions-passes.component.html',
  styleUrls: ['./missions-passes.component.css'],
})
export class MissionsPassesComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard-interimaire']);
  }
}
