import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentSnapshotNavComponent } from './installment-snapshot-nav-component';

describe('InstallmentSnapshotNavComponent', () => {
  let component: InstallmentSnapshotNavComponent;
  let fixture: ComponentFixture<InstallmentSnapshotNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentSnapshotNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentSnapshotNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
