import { TestBed } from '@angular/core/testing';

import { RtspRedirectorService } from './rtsp-redirector.service';

describe('RtspRedirectorService', () => {
  let service: RtspRedirectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RtspRedirectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
