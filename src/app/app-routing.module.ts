import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionsComponent } from './missions/missions.component';
import { MissionDetailHilguegueComponent } from './mission-detail-hilguegue/mission-detail-hilguegue.component';

const routes: Routes = [
  { path: '', redirectTo: '/missions', pathMatch: 'full' },
  { path: 'missions', component: MissionsComponent },
  { path: 'mission-detail-hilguegue/:id', component: MissionDetailHilguegueComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }