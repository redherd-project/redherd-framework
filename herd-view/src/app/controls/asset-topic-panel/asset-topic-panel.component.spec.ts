import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetTopicPanelComponent } from './asset-topic-panel.component';

describe('AssetTopicPanelComponent', () => {
  let component: AssetTopicPanelComponent;
  let fixture: ComponentFixture<AssetTopicPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTopicPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTopicPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
