import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibiliteComponent } from './disponibilite.component';

describe('DisponibiliteComponent', () => {
  let component: DisponibiliteComponent;
  let fixture: ComponentFixture<DisponibiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibiliteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisponibiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
