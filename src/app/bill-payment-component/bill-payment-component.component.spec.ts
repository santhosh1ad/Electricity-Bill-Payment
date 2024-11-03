import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPaymentComponentComponent } from './bill-payment-component.component';

describe('BillPaymentComponentComponent', () => {
  let component: BillPaymentComponentComponent;
  let fixture: ComponentFixture<BillPaymentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillPaymentComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPaymentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
