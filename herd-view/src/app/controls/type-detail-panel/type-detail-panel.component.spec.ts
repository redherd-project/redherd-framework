import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeDetailPanelComponent } from './type-detail-panel.component';

describe('TypeDetailPanelComponent', () => {
  let component: TypeDetailPanelComponent;
  let fixture: ComponentFixture<TypeDetailPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
