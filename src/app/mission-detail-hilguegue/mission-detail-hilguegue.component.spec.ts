import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MissionDetailHilguegueComponent } from './mission-detail-hilguegue.component';
import { MissionsService } from '../services/missions.service';
import { Mission } from '../models/missions.model';

describe('MissionDetailHilguegueComponent', () => {
  let component: MissionDetailHilguegueComponent;
  let fixture: ComponentFixture<MissionDetailHilguegueComponent>;
  let missionsService: MissionsService;
  const mockMission: Mission = {
    id: '1',
    name: 'Mission 1',
    status: 'Active',
    etablissementId: '1', // Ajout de la propriété etablissementId
    etablissement: { id: '1', name: 'Etablissement 1' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MissionDetailHilguegueComponent],
      providers: [
        MissionsService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionDetailHilguegueComponent);
    component = fixture.componentInstance;
    missionsService = TestBed.inject(MissionsService);

    spyOn(missionsService, 'getMissionById').and.returnValue(of(mockMission));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch mission on init', () => {
    component.ngOnInit();
    expect(component.mission).toEqual(mockMission);
  });

  it('should display mission details', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.mission-detail h2').textContent).toContain('Mission 1');
    expect(compiled.querySelector('.mission-detail h3').textContent).toContain('Active');
    expect(compiled.querySelector('.mission-detail p').textContent).toContain('Etablissement 1');
  });
});