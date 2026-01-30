import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalShopSessionNavComponent } from './physical-shop-session-nav-component';

describe('PhysicalShopSessionNavComponent', () => {
  let component: PhysicalShopSessionNavComponent;
  let fixture: ComponentFixture<PhysicalShopSessionNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalShopSessionNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalShopSessionNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
