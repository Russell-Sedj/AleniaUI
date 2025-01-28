import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MissionDetailHilguegueComponent } from './mission-detail-hilguegue.component';
import { MissionsService } from '../services/missions.service';
import { Mission } from '../../models/mission.model';

describe('MissionDetailHilguegueComponent', () => {
  let component: MissionDetailHilguegueComponent;
  let fixture: ComponentFixture<MissionDetailHilguegueComponent>;
  let missionsService: MissionsService;
  const mockMissions: Mission[] = [
    {
      id: '1',
      name: 'Mission 1',
      status: 'Active',
      etablissement: 'Etablissement 1'
    },
    {
      id: '2',
      name: 'Mission 2',
      status: 'Completed',
      etablissement: 'Etablissement 2'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MissionDetailHilguegueComponent],
      providers: [MissionsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionDetailHilguegueComponent);
    component = fixture.componentInstance;
    missionsService = TestBed.inject(MissionsService);

    spyOn(missionsService, 'getMissions').and.returnValue(of(mockMissions));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch missions on init', () => {
    component.ngOnInit();
    expect(component.missions.length).toBe(2);
    expect(component.missions).toEqual(mockMissions);
  });

  it('should display mission details', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.mission-detail h2').textContent).toContain('Mission 1');
    expect(compiled.querySelector('.mission-detail h3').textContent).toContain('Active');
    expect(compiled.querySelector('.mission-detail p').textContent).toContain('Etablissement 1');
  });
});
