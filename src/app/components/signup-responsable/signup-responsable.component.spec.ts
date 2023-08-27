import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupResponsableComponent } from './signup-responsable.component';

describe('SignupResponsableComponent', () => {
  let component: SignupResponsableComponent;
  let fixture: ComponentFixture<SignupResponsableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupResponsableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
