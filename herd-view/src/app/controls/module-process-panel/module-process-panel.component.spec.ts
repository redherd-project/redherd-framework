import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleProcessPanelComponent } from './module-process-panel.component';

describe('ModuleProcessPanelComponent', () => {
  let component: ModuleProcessPanelComponent;
  let fixture: ComponentFixture<ModuleProcessPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleProcessPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleProcessPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
