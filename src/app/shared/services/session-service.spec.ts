import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SessionService } from './session-service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores and reads an item', () => {
    service.storeItem('test-key', { value: 1 });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify({ value: 1 }));
    expect(service.getItem<{ value: number }>('test-key')).toEqual({ value: 1 });
  });

  it('returns null and logs when item does not exist', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = service.getItem('missing-key');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('No item found on this key missing-key');
  });

  it('removes one session key', () => {
    localStorage.setItem('remove-key', 'value');

    service.removeSession('remove-key');

    expect(localStorage.getItem('remove-key')).toBeNull();
  });

  it('clears all sessions', () => {
    localStorage.setItem('a', '1');
    localStorage.setItem('b', '2');

    service.clearAllSessions();

    expect(localStorage.length).toBe(0);
  });
});
