import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHeaders, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('AuthInterceptor (function-based)', () => {
  it('should add Authorization header if token exists', () => {
    const mockAuthService = {
      getToken: () => 'fake-jwt-token'
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    const request = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
      return of({} as HttpEvent<any>);
    };

    AuthInterceptor(request, next).subscribe();
  });

  it('should not add Authorization header if token does not exist', () => {
    const mockAuthService = {
      getToken: () => null
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    const request = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBeFalse();
      return of({} as HttpEvent<any>);
    };

    AuthInterceptor(request, next).subscribe();
  });
});
