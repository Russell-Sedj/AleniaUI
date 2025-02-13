import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MissionsService } from '../services/missions.service';
import { Mission } from '../models/missions.model';

@Component({
  selector: 'app-mission-detail-hilguegue',
  templateUrl: './mission-detail-hilguegue.component.html',
  styleUrls: ['./mission-detail-hilguegue.component.css'],
})
export class MissionDetailHilguegueComponent implements OnInit {
  mission: Mission | undefined;

  constructor(
    private missionsService: MissionsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.missionsService.getMissionById(id).subscribe(data => {
        this.mission = data;
        console.log('Mission:', this.mission); // Affiche les données dans la console
      });
    }
  }
}