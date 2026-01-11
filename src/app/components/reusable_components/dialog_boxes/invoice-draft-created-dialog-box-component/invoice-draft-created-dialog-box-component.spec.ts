import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDraftCreatedDialogBoxComponent } from './invoice-draft-created-dialog-box-component';

describe('InvoiceDraftCreatedDialogBoxComponent', () => {
  let component: InvoiceDraftCreatedDialogBoxComponent;
  let fixture: ComponentFixture<InvoiceDraftCreatedDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceDraftCreatedDialogBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDraftCreatedDialogBoxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
