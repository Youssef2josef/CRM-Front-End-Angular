import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsablesTableComponent } from './responsables-table.component';

describe('ResponsablesTableComponent', () => {
  let component: ResponsablesTableComponent;
  let fixture: ComponentFixture<ResponsablesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsablesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsablesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
