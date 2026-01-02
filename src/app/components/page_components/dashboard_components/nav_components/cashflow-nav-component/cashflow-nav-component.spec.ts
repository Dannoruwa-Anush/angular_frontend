import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowNavComponent } from './cashflow-nav-component';

describe('CashflowNavComponent', () => {
  let component: CashflowNavComponent;
  let fixture: ComponentFixture<CashflowNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashflowNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashflowNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
