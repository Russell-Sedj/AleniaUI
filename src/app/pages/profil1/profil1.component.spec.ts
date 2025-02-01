import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profil1Component } from './profil1.component';

describe('Profil1Component', () => {
  let component: Profil1Component;
  let fixture: ComponentFixture<Profil1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profil1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profil1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
