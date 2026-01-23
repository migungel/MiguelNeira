import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        if (error.status === 400) {
          console.error('Bad Request:', error.error);
        } else if (error.status === 404) {
          console.error('Not Found:', error.error);
        } else if (error.status === 500) {
          console.error('Server Error:', error.error);
        }

        return throwError(() => error);
      }),
    );
  }
}
