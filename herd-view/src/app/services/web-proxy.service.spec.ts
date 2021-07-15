import { TestBed } from '@angular/core/testing';

import { WebProxyService } from './web-proxy.service';

describe('WebProxyService', () => {
  let service: WebProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
