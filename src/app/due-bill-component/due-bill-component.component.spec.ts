import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueBillComponentComponent } from './due-bill-component.component';

describe('DueBillComponentComponent', () => {
  let component: DueBillComponentComponent;
  let fixture: ComponentFixture<DueBillComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueBillComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueBillComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
