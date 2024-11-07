import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchmovieComponent } from './searchmovie.component';

describe('SearchmovieComponent', () => {
  let component: SearchmovieComponent;
  let fixture: ComponentFixture<SearchmovieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchmovieComponent]
    });
    fixture = TestBed.createComponent(SearchmovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
