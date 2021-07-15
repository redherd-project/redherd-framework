import { TestBed } from '@angular/core/testing';

import { UdpProxyService } from './udp-proxy.service';

describe('UdpProxyService', () => {
  let service: UdpProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UdpProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
