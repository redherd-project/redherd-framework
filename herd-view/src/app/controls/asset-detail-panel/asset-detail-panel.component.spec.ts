import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailPanelComponent } from './asset-detail-panel.component';

describe('AssetDetailPanelComponent', () => {
  let component: AssetDetailPanelComponent;
  let fixture: ComponentFixture<AssetDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
