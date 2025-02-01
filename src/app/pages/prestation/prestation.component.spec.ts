import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationComponent } from './prestation.component';

describe('PrestationComponent', () => {
  let component: PrestationComponent;
  let fixture: ComponentFixture<PrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
