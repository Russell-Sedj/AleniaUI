import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Offres2Component } from './offres2.component';

describe('Offres2Component', () => {
  let component: Offres2Component;
  let fixture: ComponentFixture<Offres2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Offres2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Offres2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
