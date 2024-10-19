import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePosteComponent } from './fiche-poste.component';

describe('FichePosteComponent', () => {
  let component: FichePosteComponent;
  let fixture: ComponentFixture<FichePosteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichePosteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichePosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
