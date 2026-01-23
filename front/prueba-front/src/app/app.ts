import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('prueba-front');
  showErrorModal = false;
  errorMessage = '';

  constructor(
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.notificationService.error$.subscribe((error) => {
      this.showErrorModal = true;
      this.errorMessage = error;
      this.cdr.markForCheck();
    });
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }
}
