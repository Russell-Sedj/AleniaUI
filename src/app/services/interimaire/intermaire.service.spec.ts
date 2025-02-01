import { TestBed } from '@angular/core/testing';

import { IntermaireService } from './intermaire.service';

describe('IntermaireService', () => {
  let service: IntermaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntermaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
