import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.notificationService.showError('Servidor no disponible');
        } else if (error.status === 400) {
          const message = error.error?.message || 'Solicitud incorrecta';
          this.notificationService.showError(message);
        } else if (error.status === 404) {
          const message = error.error?.message || 'Recurso no encontrado';
          this.notificationService.showError(message);
        } else if (error.status === 500) {
          const message = error.error?.message || 'Error interno del servidor';
          this.notificationService.showError(message);
        }

        return throwError(() => error);
      }),
    );
  }
}
