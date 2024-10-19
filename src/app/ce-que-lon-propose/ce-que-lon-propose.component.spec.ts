import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeQueLonProposeComponent } from './ce-que-lon-propose.component';

describe('CeQueLonProposeComponent', () => {
  let component: CeQueLonProposeComponent;
  let fixture: ComponentFixture<CeQueLonProposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeQueLonProposeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeQueLonProposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
