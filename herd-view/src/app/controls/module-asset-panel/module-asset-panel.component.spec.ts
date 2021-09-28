import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleAssetPanelComponent } from './module-asset-panel.component';

describe('ModuleAssetPanelComponent', () => {
  let component: ModuleAssetPanelComponent;
  let fixture: ComponentFixture<ModuleAssetPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleAssetPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleAssetPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
