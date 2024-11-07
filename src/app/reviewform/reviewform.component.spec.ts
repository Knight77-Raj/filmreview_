import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewformComponent } from './reviewform.component';

describe('ReviewformComponent', () => {
  let component: ReviewformComponent;
  let fixture: ComponentFixture<ReviewformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewformComponent]
    });
    fixture = TestBed.createComponent(ReviewformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
