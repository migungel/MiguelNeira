import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteComponent } from './modal-delete.component';

describe('ModalDelete', () => {
  let component: ModalDeleteComponent;
  let fixture: ComponentFixture<ModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDeleteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
