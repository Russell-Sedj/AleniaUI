import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningEntrepriseComponent } from './planning-entreprise.component';

describe('PlanningEntrepriseComponent', () => {
  let component: PlanningEntrepriseComponent;
  let fixture: ComponentFixture<PlanningEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningEntrepriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
