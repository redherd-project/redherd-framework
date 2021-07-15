import { TestBed } from '@angular/core/testing';

import { TcpProxyService } from './tcp-proxy.service';

describe('TcpProxyService', () => {
  let service: TcpProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcpProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
