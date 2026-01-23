import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' | 'warning' = 'success';
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    if (!this.isEditMode) {
      this.setDateRelease();
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this.idExistsValidator],
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateValidator.bind(this)]],
      date_revision: ['', [Validators.required, this.revisionDateValidator.bind(this)]],
    });
  }

  private idExistsValidator = (control: AbstractControl) => {
    if (!control.value || this.isEditMode) {
      return of(null);
    }
    return this.productsService.verifyProductId(control.value).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null)),
    );
  };

  private setDateRelease() {
    this.productForm.get('date_release')?.valueChanges.subscribe((releaseDate) => {
      if (releaseDate) {
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        const revisionDateString = revisionDate.toISOString().split('T')[0];
        this.productForm.get('date_revision')?.setValue(revisionDateString);
      }
      this.productForm.get('date_revision')?.updateValueAndValidity();
    });
  }

  private dateValidator(control: AbstractControl) {
    if (!control.value) return null;
    const today = new Date();
    const todayString =
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0');
    const selectedDate = control.value;
    return selectedDate >= todayString ? null : { invalidDate: true };
  }

  private revisionDateValidator(control: AbstractControl) {
    const releaseDate = this.productForm?.get('date_release')?.value;
    if (!releaseDate || !control.value) return null;
    const expectedDate = new Date(releaseDate);
    expectedDate.setFullYear(expectedDate.getFullYear() + 1);
    const expectedDateString = expectedDate.toISOString().split('T')[0];
    return control.value === expectedDateString ? null : { invalidRevisionDate: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isEditMode) {
        this.editRegister();
      } else {
        this.createRegister();
      }
    } else {
      this.productForm.markAllAsTouched();
      this.openModal(
        'Formulario inválido',
        'Por favor completa todos los campos correctamente',
        'warning',
      );
    }
  }

  createRegister() {
    const productData: Product = this.productForm.value;
    this.productsService.createProduct(productData).subscribe({
      next: (response) => {
        this.openModal('¡Éxito!', response.message, 'success');
        this.onReset();
      },
      error: (error) => {
        this.openModal('Error', error.error?.message || 'Error al crear el producto', 'error');
      },
    });
  }

  onReset(): void {
    if (this.isEditMode) {
      this.loadProductForEdit();
      // const currentId = this.productForm.get('id')?.value;
      // this.productForm.reset();
      // this.productForm.patchValue({ id: currentId });
      // this.productForm.get('id')?.disable();
    } else {
      this.productForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  private openModal(title: string, message: string, type: 'success' | 'error' | 'warning') {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
    this.cdr.markForCheck();
  }

  goBack(): void {
    this.router.navigate(['/products']).then(() => {
      window.location.reload();
    });
  }

  /* F5 */
  private checkEditMode(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode) {
      this.loadProductForEdit();
    }
  }

  private loadProductForEdit(): void {
    this.productsService.getProductById(this.productId!).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.productForm.get('id')?.disable();
        this.setDateRelease();
      },
      error: (error) => console.error('Error loading product:', error),
    });
  }

  private editRegister() {
    const productData = this.productForm.getRawValue();
    const { id, ...updateData } = productData;

    this.productsService.updateProduct(this.productId!, updateData).subscribe({
      next: (response) => {
        this.openModal('¡Éxito!', response.message, 'success');
      },
      error: (error) => {
        this.openModal('Error', error.error?.message || 'Error al actualizar el producto', 'error');
      },
    });
  }
}
