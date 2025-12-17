import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandNavComponent } from './brand-nav-component';

describe('BrandNavComponent', () => {
  let component: BrandNavComponent;
  let fixture: ComponentFixture<BrandNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
