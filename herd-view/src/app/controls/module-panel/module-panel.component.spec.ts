import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePanelComponent } from './module-panel.component';

describe('ModulePanelComponent', () => {
  let component: ModulePanelComponent;
  let fixture: ComponentFixture<ModulePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
