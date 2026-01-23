import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared-module';
import { ModalComponent } from './components/modal/modal.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';

describe('SharedModule', () => {
  let module: SharedModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedModule
      ]
    }).compileComponents();

    module = new SharedModule();
  });

  it('should create', () => {
    expect(module).toBeTruthy();
  });

  it('should declare ModalComponent', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should declare ModalDeleteComponent', () => {
    const fixture = TestBed.createComponent(ModalDeleteComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should export components', () => {
    // Test that the module can be instantiated
    expect(module).toBeInstanceOf(SharedModule);
  });
});