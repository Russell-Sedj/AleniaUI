import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreEntrepriseComponent } from './parametre-entreprise.component';

describe('ParametreEntrepriseComponent', () => {
  let component: ParametreEntrepriseComponent;
  let fixture: ComponentFixture<ParametreEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametreEntrepriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
