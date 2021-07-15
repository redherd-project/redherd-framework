import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicDetailPanelComponent } from './topic-detail-panel.component';

describe('TopicDetailPanelComponent', () => {
  let component: TopicDetailPanelComponent;
  let fixture: ComponentFixture<TopicDetailPanelComponent>;

  beforeEach(async(() => {
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
