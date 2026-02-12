import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  storeItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if(!value) {
      console.error(`No item found on this key ${key}`);
      return null;
    }
    return JSON.parse(value) as T
  }
  removeSession(key: string): void {
    localStorage.removeItem(key);
  }
  clearAllSessions(): void {
    localStorage.clear();
  }
}
