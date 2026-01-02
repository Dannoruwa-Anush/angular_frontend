import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplPlanNavComponent } from './bnpl-plan-nav-component';

describe('BnplPlanNavComponent', () => {
  let component: BnplPlanNavComponent;
  let fixture: ComponentFixture<BnplPlanNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnplPlanNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnplPlanNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
