// src/app/service/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, tap } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router); // Inject Router

  // 1. Add the access token to the original request
  const accessToken = authService.getToken();
  let modifiedReq = req;

  if (accessToken) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // 2. Send the request and handle errors
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 3. Check if it's a 401 error
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();

        // a. If refresh token exists, attempt refresh
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((response) => {
              // c. Refresh successful: Retry the original request with new token
              const newAccessToken = response.access; // Assuming response has 'access'
              const retryReq = req.clone({ // Use the original request (req), not modifiedReq
                 setHeaders: {
                   Authorization: `Bearer ${newAccessToken}`
                 }
              });
              return next(retryReq); // Send the retried request
            }),
            catchError((refreshError) => {
              // e. Refresh failed: Log out the user
              console.error('Token refresh failed', refreshError);
              authService.logout(); // This should clear tokens and redirect
              router.navigate(['/login']); // Ensure redirect to login
              return throwError(() => refreshError); // Propagate the refresh error
            })
          );
        } else {
           // e. No refresh token: User needs to log in
           authService.logout(); // Clear any stale tokens
           router.navigate(['/login']);
           return throwError(() => new Error('No refresh token available. User logged out.'));
        }
      }

      // If it's not a 401, or we handled the 401 by logging out, propagate the error
      return throwError(() => error);
    })
  );
};