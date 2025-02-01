import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Mission } from '../../models/mission.model';
import { MissionService } from '../../services/mission/mission.service';
import { CommonModule } from '@angular/common';
// import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './missions.component.html',
  styleUrls: ['../../../../public/assets/Css/style3.css'],
})
export class MissionsComponent implements OnInit {
  missionList: Mission[] = [];

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.missionService.getMissions().subscribe((response: any) => {
      this.missionList = response.$values;
    });
  }
}
