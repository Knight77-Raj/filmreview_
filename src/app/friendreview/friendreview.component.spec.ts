import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendreviewComponent } from './friendreview.component';

describe('FriendreviewComponent', () => {
  let component: FriendreviewComponent;
  let fixture: ComponentFixture<FriendreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendreviewComponent]
    });
    fixture = TestBed.createComponent(FriendreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
