import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private USER_ID_KEY = 'userId';
  private readonly USERNAME_KEY = 'username';

  constructor() {
    const storedUserId = localStorage.getItem(this.USER_ID_KEY);
    this.userId = storedUserId ? parseInt(storedUserId, 10) : null;
    this.username = localStorage.getItem(this.USERNAME_KEY);
  }

  private userId: number | null = null;
  private username: string | null = null;

  setUserId(id: number) {
    this.userId = id;
    localStorage.setItem(this.USER_ID_KEY, id.toString()); // Convert the number to a string
  }

  getUserId(): number | null {
    const storedId = localStorage.getItem(this.USER_ID_KEY);
    return storedId ? parseInt(storedId, 10) : null; // Convert the string back to a number
  }

  clearUserId() {
    this.userId = null;
    localStorage.removeItem(this.USER_ID_KEY);
  }

  setUsername(name: string) {
    this.username = name;
    localStorage.setItem(this.USERNAME_KEY, name);
  }

  getUsername(): string | null {
    return this.username;
  }

 

  isAuthenticated(): boolean {
    return this.userId !== null;
  }

  clearAll(){
   this.username = null;
   localStorage.removeItem(this.USERNAME_KEY);
    this.userId = null;
    localStorage.removeItem(this.USER_ID_KEY);
  }
}
