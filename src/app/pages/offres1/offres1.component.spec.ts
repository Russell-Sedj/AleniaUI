import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Offres1Component } from './offres1.component';

describe('Offres1Component', () => {
  let component: Offres1Component;
  let fixture: ComponentFixture<Offres1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Offres1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Offres1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
