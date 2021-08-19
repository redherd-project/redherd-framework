import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetPanelComponent } from './asset-panel.component';

describe('AssetPanelComponent', () => {
  let component: AssetPanelComponent;
  let fixture: ComponentFixture<AssetPanelComponent>;

  beforeEach(waitForAsync(() => {
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
