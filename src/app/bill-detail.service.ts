import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BillDetailService {
  private customerIdKey = 'customerId';
  private dueIdKey = 'dueId'; 

  constructor() {}

  
  setCustomerId(customerId: string): void {
    localStorage.setItem(this.customerIdKey, customerId);
  }

  getCustomerId(): string | null {
    return localStorage.getItem(this.customerIdKey);
  }

  removeCustomerId(): void {
    localStorage.removeItem(this.customerIdKey);
  }

  // Manage Due ID
  setDueId(dueId: string): void {
    localStorage.setItem(this.dueIdKey, dueId);
  }

  getDueId(): string | null {
    return localStorage.getItem(this.dueIdKey);
  }

  removeDueId(): void {
    localStorage.removeItem(this.dueIdKey);
  }

  
  clearAll(): void {
    localStorage.removeItem(this.customerIdKey);
    localStorage.removeItem(this.dueIdKey);
  }
}
