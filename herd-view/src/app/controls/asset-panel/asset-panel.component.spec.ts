import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPanelComponent } from './asset-panel.component';

describe('AssetPanelComponent', () => {
  let component: AssetPanelComponent;
  let fixture: ComponentFixture<AssetPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
