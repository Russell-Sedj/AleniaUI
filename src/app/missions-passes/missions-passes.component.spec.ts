import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsPassesComponent } from './missions-passes.component';

describe('MissionsPassesComponent', () => {
  let component: MissionsPassesComponent;
  let fixture: ComponentFixture<MissionsPassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionsPassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsPassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
