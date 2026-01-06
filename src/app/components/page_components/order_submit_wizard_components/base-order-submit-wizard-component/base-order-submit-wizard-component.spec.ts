import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseOrderSubmitWizardComponent } from './base-order-submit-wizard-component';

describe('BaseOrderSubmitWizardComponent', () => {
  let component: BaseOrderSubmitWizardComponent;
  let fixture: ComponentFixture<BaseOrderSubmitWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseOrderSubmitWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseOrderSubmitWizardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
