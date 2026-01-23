import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  standalone: false,
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css',
})
export class ModalDeleteComponent {
  @Input() isVisible = false;
  @Input() productName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
