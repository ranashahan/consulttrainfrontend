import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  // Add the access token if it exists
  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `${accessToken}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      console.log('Token Interceptor Error:', error);
      // If 401 Unauthorized, try to refresh the token
      if (error.status === 401 && !req.url.includes('/refreshtoken')) {
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            // Clone and reprocess the request with the new token
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `${tokens.accessToken}`,
                },
              })
            );
          }),
          catchError((refreshError) => {
            console.error('Token refresh failed:', refreshError);
            // Handle refresh token errors (logout or redirect to login)
            authService.logout(); // Implement logout logic in your AuthService
            window.location.href = '/login';
            const errorMessage =
              refreshError.error?.message ||
              refreshError.message ||
              'Unknown error during token refresh';
            return throwError(() => new Error(errorMessage));
          })
        );
      }
      const errorMessage =
        error.error?.message || error.message || 'Unknown error occurred';
      return throwError(() => new Error(errorMessage));
    })
  );
};
