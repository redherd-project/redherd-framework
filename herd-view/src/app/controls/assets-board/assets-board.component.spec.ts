import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsBoardComponent } from './assets-board.component';

describe('AssetBoardComponent', () => {
  let component: AssetsBoardComponent;
  let fixture: ComponentFixture<AssetsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
