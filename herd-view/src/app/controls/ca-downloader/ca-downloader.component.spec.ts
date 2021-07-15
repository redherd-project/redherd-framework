import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDownloaderComponent } from './ca-downloader.component';

describe('CaDownloaderComponent', () => {
  let component: CaDownloaderComponent;
  let fixture: ComponentFixture<CaDownloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaDownloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
