import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBillComponentComponent } from './pay-bill-component.component';

describe('PayBillComponentComponent', () => {
  let component: PayBillComponentComponent;
  let fixture: ComponentFixture<PayBillComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayBillComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayBillComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
