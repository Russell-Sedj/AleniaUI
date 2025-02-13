import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionsService } from '../services/missions.service';
import { Mission } from '../models/missions.model';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css'],
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [];

  constructor(private missionsService: MissionsService, private router: Router) {}

  ngOnInit(): void {
    this.missionsService.getMissions().subscribe(data => {
      this.missions = data;
      console.log('Missions:', this.missions); // Affiche les données dans la console
    });
  }

  viewMissionDetails(id: string): void {
    this.router.navigate(['/mission-detail-hilguegue', id]);
  }
}

// import { Component, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { MissionsService } from '../services/missions.service';
// import { Mission } from '../../models/missions.model';

// @Component({
//   selector: 'app-missions',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './missions.component.html',
//   styleUrls: ['../../../public/assets/Css/style3.css'],
// })
// export class MissionsComponent implements OnInit {
//   missions: Mission[] = [];

//   constructor(private missionsService: MissionsService) {}

//   ngOnInit(): void {
//     this.missionsService.getMissions().subscribe(data => {
//       this.missions = data;
//       console.log('Missions:', this.missions); // Affiche les données dans la console
//     });
//   }
// }