import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Assurez-vous que RouterModule est importé
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MissionsComponent } from './missions/missions.component';
import { MissionDetailHilguegueComponent } from './mission-detail-hilguegue/mission-detail-hilguegue.component';

@NgModule({
  declarations: [
    AppComponent,
    MissionsComponent,
    MissionDetailHilguegueComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule, // Ajoutez RouterModule ici
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }