import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedBillsService {
  private selectedBillsSource = new BehaviorSubject<any[]>(
    this.loadSelectedBillsFromLocalStorage()
  );
  selectedBills$ = this.selectedBillsSource.asObservable();

  constructor() {}

  setSelectedBills(bills: any[]) {
    this.selectedBillsSource.next(bills);
    this.saveSelectedBillsToLocalStorage(bills);
  }

  resetSelectedBills() {
    this.selectedBillsSource.next([]);
    this.saveSelectedBillsToLocalStorage([]); // Clear local storage
  }

  private saveSelectedBillsToLocalStorage(bills: any[]) {
    localStorage.setItem('selectedBills', JSON.stringify(bills));
  }

  private loadSelectedBillsFromLocalStorage(): any[] {
    const bills = localStorage.getItem('selectedBills');
    return bills ? JSON.parse(bills) : [];
  }
}
