import { TestBed } from '@angular/core/testing';

import { TranactServiceService } from './tranact-service.service';

describe('TranactServiceService', () => {
  let service: TranactServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranactServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
