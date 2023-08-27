import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsembleRapportsComponent } from './ensemble-rapports.component';

describe('EnsembleRapportsComponent', () => {
  let component: EnsembleRapportsComponent;
  let fixture: ComponentFixture<EnsembleRapportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnsembleRapportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnsembleRapportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
