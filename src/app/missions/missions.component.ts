import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Missions } from '../../models/missions.model';
// import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './missions.component.html',
  styleUrls: ['../../../public/assets/Css/style3.css'],
})
export class MissionsComponent {
  http = inject(HttpClient);

  Missions$ = this.getMissions();

  // ngOnInit() {
  //   this.getMissions().subscribe((missions) => console.log(missions));
  // }

  private getMissions(): Observable<Missions[]> {
    return this.http.get<Missions[]>('https://localhost:7134/api/Missions');
  }
}
