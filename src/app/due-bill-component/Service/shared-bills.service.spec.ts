import { TestBed } from '@angular/core/testing';

import { SharedBillsService } from './shared-bills.service';

describe('SharedBillsService', () => {
  let service: SharedBillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedBillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
