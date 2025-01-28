import { Component, OnInit } from '@angular/core';
import { MissionsService } from '../services/missions.service';
import { Mission } from '../../models/missions.models';

@Component({
  selector: 'app-mission-detail-hilguegue',
  templateUrl: './mission-detail-hilguegue.component.html',
  styleUrls: ['../../../public/assets/Css/style4.css'],
})
export class MissionDetailHilguegueComponent implements OnInit {
  missions: Mission[] = [];

  constructor(private missionsService: MissionsService) {}

  ngOnInit(): void {
    this.missionsService.getMissions().subscribe((data) => {
      this.missions = data;
      console.log('Missions:', this.missions); // Affiche les données dans la console
    });
  }
}