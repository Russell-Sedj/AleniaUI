import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Missions } from '../../models/missions.model';
import { MissionsService } from '../services/missions.service';
// import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './missions.component.html',
  styleUrls: ['../../../public/assets/Css/style3.css'],
})
export class MissionsComponent implements OnInit {
  missionsList: Missions[] = [];

  constructor(private missionsService: MissionsService) {}

  ngOnInit(): void {
    this.missionsService.getMissions().subscribe((items) => {
      this.missionsList = items;
    });
    this.missionsService.getMissions().subscribe((items) => {
      console.log(items);
    });
  }
}
