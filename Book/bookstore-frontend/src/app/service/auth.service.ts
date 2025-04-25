import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  refresh: string;
  access: string;
}

interface LogoutResponse {} // Django logout обычно не возвращает тела

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/'; // Базовый URL вашего Django API
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}register/`, credentials).pipe(
      tap(response => this.setTokens(response))
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}login/`, credentials).pipe(
      tap(response => this.setTokens(response)),
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  logout(): Observable<LogoutResponse> {
    const refreshToken = this.getRefreshToken();
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticatedSubject.next(false);
    return this.http.post<LogoutResponse>(`${this.apiUrl}logout/`, { refresh_token: refreshToken });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}login/refresh/`, { refresh: refreshToken }).pipe(
      tap(response => this.setTokens(response))
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.access);
    localStorage.setItem(this.refreshTokenKey, response.refresh);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }
}