import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesBoardComponent } from './modules-board.component';

describe('ModulesBoardComponent', () => {
  let component: ModulesBoardComponent;
  let fixture: ComponentFixture<ModulesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulesBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
