import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsTableComponent } from './objects-table.component';

describe('ObjectsTableComponent', () => {
  let component: ObjectsTableComponent;
  let fixture: ComponentFixture<ObjectsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
