import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInterimaireComponent } from './dashboard-interimaire.component';

describe('DashboardInterimaireComponent', () => {
  let component: DashboardInterimaireComponent;
  let fixture: ComponentFixture<DashboardInterimaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInterimaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardInterimaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
