import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}users`;
  private roles: string[] = [];
  constructor(private http: HttpClient) {}

  // Login user and get access and refresh tokens
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((tokens) => {
          localStorage?.setItem('email', tokens.email);
          localStorage?.setItem('id', tokens.id);
          localStorage?.setItem('username', tokens.username);
          localStorage?.setItem('role', tokens.role);
          this.storeTokens(tokens.accessToken, tokens.refreshToken);
        }),
        catchError(this.handleError)
      );
  }

  // Get new access token using refresh token
  refreshToken(): Observable<any> {
    const refreshtoken = this.getRefreshToken();
    return this.http
      .post<any>(`${this.apiUrl}/refreshtoken`, { refreshtoken })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens.accessToken, tokens.refreshToken);
        }),
        catchError(this.handleError)
      );
  }
  // Store tokens in localStorage or sessionStorage
  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Retrieve access token from storage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  // Retrieve username from storage
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
  // Retrieve userid from storage
  getUserID(): string {
    // return localStorage.getItem('id');
    return JSON.parse(localStorage.getItem('id')!);
  }
  // Retrieve userid from storage
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
  // Retrieve user email from storage
  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  // Retrieve refresh token from storage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setUserRole() {
    this.roles = [this.getUserRole() ?? 'member'];
  }
  // Helper method to check if a user has a specific role
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  // Method to check if a user has any roles from an array
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }
  logout(): void {
    const userid = this.getUserID();
    console.log('My userid ' + userid);
    this.http.post(`${this.apiUrl}/logout`, { userid }).subscribe();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }
  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
