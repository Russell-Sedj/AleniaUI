import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDetailHilguegueComponent } from './mission-detail-hilguegue.component';

describe('MissionDetailHilguegueComponent', () => {
  let component: MissionDetailHilguegueComponent;
  let fixture: ComponentFixture<MissionDetailHilguegueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionDetailHilguegueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionDetailHilguegueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
