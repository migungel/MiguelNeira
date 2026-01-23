import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly errorSubject = new Subject<string>();
  error$ = this.errorSubject.asObservable();

  showError(message: string): void {
    this.errorSubject.next(message);
  }
}
