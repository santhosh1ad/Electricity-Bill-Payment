import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkBillPaymentComponentComponent } from './bulk-bill-payment-component.component';

describe('BulkBillPaymentComponentComponent', () => {
  let component: BulkBillPaymentComponentComponent;
  let fixture: ComponentFixture<BulkBillPaymentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkBillPaymentComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkBillPaymentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
