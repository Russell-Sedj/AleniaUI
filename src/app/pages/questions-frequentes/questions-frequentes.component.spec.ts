import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsFrequentesComponent } from './questions-frequentes.component';

describe('QuestionsFrequentesComponent', () => {
  let component: QuestionsFrequentesComponent;
  let fixture: ComponentFixture<QuestionsFrequentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsFrequentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsFrequentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
