import { TestBed } from '@angular/core/testing';

import { BillDetailService } from './bill-detail.service';

describe('BillDetailService', () => {
  let service: BillDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
