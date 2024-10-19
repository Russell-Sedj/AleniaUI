import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profil2Component } from './profil2.component';

describe('Profil2Component', () => {
  let component: Profil2Component;
  let fixture: ComponentFixture<Profil2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profil2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profil2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
