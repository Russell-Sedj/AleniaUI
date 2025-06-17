

import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Mission } from '../../models/mission.model';
import { MissionService } from '../../services/mission/mission.service';
import { Etablissement } from '../../models/etablissement.model';
import { EtablissementService } from '../../services/etablissement/etablissement.service';
import { CommonModule } from '@angular/common';
// import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css'],
})
export class MissionsComponent implements OnInit {
  missionList: (Mission & { etablissement?: Etablissement })[] = [];
  isLoading = true;

  constructor(
    private missionService: MissionService,
    private etablissementService: EtablissementService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.missionService.getMissions().subscribe((response: any) => {
      const missions = response.$values;
      let loadedCount = 0;
      
      if (missions.length === 0) {
        this.isLoading = false;
        return;
      }
      
      missions.forEach((mission: Mission) => {
        this.etablissementService
          .getEtablissement(mission.etablissementId)
          .subscribe((etablissement: Etablissement) => {
            this.missionList.push({
              ...mission,
              etablissement: etablissement
            });
            loadedCount++;
            
            // Set loading to false when all missions are loaded
            if (loadedCount === missions.length) {
              this.isLoading = false;
            }
          });
      });
    });
  }
}