import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePanelComponent } from './type-panel.component';

describe('TypePanelComponent', () => {
  let component: TypePanelComponent;
  let fixture: ComponentFixture<TypePanelComponent>;

  beforeEach(async(() => {
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
