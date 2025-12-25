import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNavComponent } from './category-nav-component';

describe('CategoryNavComponent', () => {
  let component: CategoryNavComponent;
  let fixture: ComponentFixture<CategoryNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
