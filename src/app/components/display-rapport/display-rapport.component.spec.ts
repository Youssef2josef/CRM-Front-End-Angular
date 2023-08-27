import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRapportComponent } from './display-rapport.component';

describe('DisplayRapportComponent', () => {
  let component: DisplayRapportComponent;
  let fixture: ComponentFixture<DisplayRapportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayRapportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
