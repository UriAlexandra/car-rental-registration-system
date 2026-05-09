import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Vehicle } from '../../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  private apiBase = this.resolveApiBase();
  private urlBase = `${this.apiBase}/vehicles`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Jármű létrehozása
  createVehicle(data: any): Observable<any> {
    return this.http.post(this.urlBase, data).pipe(catchError(this.errorMgmt));
  }

  // Összes jármű lekérése
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<any>(this.urlBase).pipe(
      map((res: any) => {
        if (Array.isArray(res)) {
          return res;
        }
        if (Array.isArray(res?.value)) {
          return res.value;
        }
        const nestedArray = Object.values(res ?? {}).find(Array.isArray);
        return Array.isArray(nestedArray) ? (nestedArray as Vehicle[]) : [];
      }),
      catchError(this.errorMgmt)
    );
  }

  // Egy konkrét jármű lekérése ID alapján
  getVehicle(id: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // Jármű adatainak frissítése
  updateVehicle(id: any, data: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    );
  }

  // Jármű törlése
  deleteVehicle(id: any): Observable<any> {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    );
  }

  // API URL feloldása (Localhost vs Production)
  private resolveApiBase(): string {
    if (typeof window === 'undefined') {
      return 'http://localhost:4000/api';
    }

    return window.location.port === '4000'
      ? '/api'
      : `${window.location.protocol}//${window.location.hostname}:4000/api`;
  }

  // Hibakezelés
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Kliens oldali hiba
      errorMessage = error.error.message;
    } else {
      // Szerver oldali hiba
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}