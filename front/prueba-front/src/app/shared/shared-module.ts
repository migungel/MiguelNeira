import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';

@NgModule({
  declarations: [ModalComponent, ModalDeleteComponent],
  imports: [CommonModule],
  exports: [ModalComponent, ModalDeleteComponent],
})
export class SharedModule {}
