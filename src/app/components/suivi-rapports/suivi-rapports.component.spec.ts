import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviRapportsComponent } from './suivi-rapports.component';

describe('SuiviRapportsComponent', () => {
  let component: SuiviRapportsComponent;
  let fixture: ComponentFixture<SuiviRapportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviRapportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviRapportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
