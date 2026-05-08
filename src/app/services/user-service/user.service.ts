import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly storageKey = 'currentUser';
  private apiBase = this.resolveApiBase();
  private urlBase = `${this.apiBase}/users`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    this.currentUser = this.readStoredUser();
  }

  // Regisztráció
  createUser(data: any): Observable<any> {
    return this.http.post(this.urlBase, data).pipe(catchError(this.errorMgmt));
  }

  // Bejelentkezés - Új metódus
  loginUser(data: any): Observable<any> {
    const url = `${this.urlBase}/login`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  // Összes felhasználó lekérése
  getUsers(): Observable<any> {
    return this.http.get(this.urlBase).pipe(catchError(this.errorMgmt));
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
    if (typeof window === 'undefined') {
      return;
    }
    if (user) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private resolveApiBase(): string {
    if (typeof window === 'undefined') {
      return 'http://localhost:4000/api';
    }
    return window.location.port === '4000'
     ? '/api'
      : `${window.location.protocol}//${window.location.hostname}:4000/api`;
  }

  private readStoredUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const storedUser = window.localStorage.getItem(this.storageKey);
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      window.localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Kliens oldali hiba
      errorMessage = error.error.message;
    } else {
      // Szerver oldali hiba - Kinyerjük a backend által küldött üzenetet
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}