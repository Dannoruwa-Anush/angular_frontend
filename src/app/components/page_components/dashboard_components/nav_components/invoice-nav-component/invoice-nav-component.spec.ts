import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNavComponent } from './invoice-nav-component';

describe('InvoiceNavComponent', () => {
  let component: InvoiceNavComponent;
  let fixture: ComponentFixture<InvoiceNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
