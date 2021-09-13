import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTabComponent } from './module-tab.component';

describe('ModuleTabComponent', () => {
  let component: ModuleTabComponent;
  let fixture: ComponentFixture<ModuleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
