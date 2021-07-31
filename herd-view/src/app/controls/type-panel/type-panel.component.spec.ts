import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypePanelComponent } from './type-panel.component';

describe('TypePanelComponent', () => {
  let component: TypePanelComponent;
  let fixture: ComponentFixture<TypePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
