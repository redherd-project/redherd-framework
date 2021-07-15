import { TestBed } from '@angular/core/testing';

import { FilemanagerService } from './filemanager.service';

describe('FilemanagerService', () => {
  let service: FilemanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilemanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
