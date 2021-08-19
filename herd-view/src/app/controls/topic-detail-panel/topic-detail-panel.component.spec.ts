import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopicDetailPanelComponent } from './topic-detail-panel.component';

describe('TopicDetailPanelComponent', () => {
  let component: TopicDetailPanelComponent;
  let fixture: ComponentFixture<TopicDetailPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
