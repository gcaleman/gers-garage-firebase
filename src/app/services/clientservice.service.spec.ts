import { TestBed } from '@angular/core/testing';

import { ClientserviceService } from './clientservice.service';

describe('ClientserviceService', () => {
  let service: ClientserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
