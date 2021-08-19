import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleWrapperComponent } from './module-wrapper.component';

describe('ModuleWrapperComponent', () => {
  let component: ModuleWrapperComponent;
  let fixture: ComponentFixture<ModuleWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
