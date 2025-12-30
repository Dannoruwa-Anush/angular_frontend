import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplPlanTypeNavComponent } from './bnpl-plan-type-nav-component';

describe('BnplPlanTypeNavComponent', () => {
  let component: BnplPlanTypeNavComponent;
  let fixture: ComponentFixture<BnplPlanTypeNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnplPlanTypeNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnplPlanTypeNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
