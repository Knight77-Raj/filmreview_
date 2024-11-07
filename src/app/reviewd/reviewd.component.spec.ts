import { ComponentFixture, TestBed } from '@angular/core/testing';
// @ts-ignore
import { ReviewdComponent } from './reviewd.component';

describe('ReviewdComponent', () => {
  let component: ReviewdComponent;
  let fixture: ComponentFixture<ReviewdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewdComponent]
    });
    fixture = TestBed.createComponent(ReviewdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
