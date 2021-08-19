import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleDetailPanelComponent } from './module-detail-panel.component';

describe('ModuleDetailPanelComponent', () => {
  let component: ModuleDetailPanelComponent;
  let fixture: ComponentFixture<ModuleDetailPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
