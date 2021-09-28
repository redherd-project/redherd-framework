import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOutputPanelComponent } from './module-output-panel.component';

describe('ModuleOutputPanelComponent', () => {
  let component: ModuleOutputPanelComponent;
  let fixture: ComponentFixture<ModuleOutputPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleOutputPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOutputPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
