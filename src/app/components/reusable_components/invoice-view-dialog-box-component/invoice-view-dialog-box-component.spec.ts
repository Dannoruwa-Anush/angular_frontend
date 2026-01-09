import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceViewDialogBoxComponent } from './invoice-view-dialog-box-component';

describe('InvoiceViewDialogBoxComponent', () => {
  let component: InvoiceViewDialogBoxComponent;
  let fixture: ComponentFixture<InvoiceViewDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceViewDialogBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceViewDialogBoxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
