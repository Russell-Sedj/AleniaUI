import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEtablissementComponent } from './dashboard-etablissement.component';

describe('DashboardEtablissementComponent', () => {
  let component: DashboardEtablissementComponent;
  let fixture: ComponentFixture<DashboardEtablissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEtablissementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEtablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
