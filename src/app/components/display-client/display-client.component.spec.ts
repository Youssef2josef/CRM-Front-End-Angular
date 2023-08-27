import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayClientComponent } from './display-client.component';

describe('DisplayClientComponent', () => {
  let component: DisplayClientComponent;
  let fixture: ComponentFixture<DisplayClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
