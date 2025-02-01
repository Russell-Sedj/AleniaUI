import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsVenirComponent } from './missions-venir.component';

describe('MissionsVenirComponent', () => {
  let component: MissionsVenirComponent;
  let fixture: ComponentFixture<MissionsVenirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionsVenirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsVenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
