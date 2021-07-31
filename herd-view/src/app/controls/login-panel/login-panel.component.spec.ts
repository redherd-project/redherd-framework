import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginPanelComponent } from './login-panel.component';

describe('LoginPanelComponent', () => {
  let component: LoginPanelComponent;
  let fixture: ComponentFixture<LoginPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
