import { TestBed } from '@angular/core/testing';

import { BulkserviceService } from './bulkservice.service';

describe('BulkserviceService', () => {
  let service: BulkserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
