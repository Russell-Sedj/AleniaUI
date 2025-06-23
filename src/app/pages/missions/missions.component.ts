

import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { MissionService, MissionDto } from '../../services/mission/mission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css'],
})
export class MissionsComponent implements OnInit {
  missionList: MissionDto[] = [];
  isLoading = true;
  constructor(
    private missionService: MissionService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.missionService.getAllMissions().subscribe({
      next: (missions: MissionDto[]) => {
        this.missionList = missions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des missions:', error);
        this.isLoading = false;
      }
    });
  }
}