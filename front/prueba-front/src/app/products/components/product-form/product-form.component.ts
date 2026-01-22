import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

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

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setDateRelease();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateValidator.bind(this)]],
      date_revision: ['', [Validators.required, this.revisionDateValidator.bind(this)]],
    });
  }

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
      const productData: Product = this.productForm.value;
      console.log('Datos del producto:', productData);
      this.productsService.createProduct(productData).subscribe({
        next: (response) => {
          this.modalTitle = '¡Éxito!';
          this.modalMessage = response.message;
          this.modalType = 'success';
          this.showModal = true;
          this.productForm.reset();
        },
        error: (error) => {
          this.modalTitle = 'Error';
          this.modalMessage = error.error?.message || 'Error al crear el producto';
          this.modalType = 'error';
          this.showModal = true;
        },
      });
    } else {
      this.modalTitle = 'Formulario inválido';
      this.modalMessage = 'Por favor completa todos los campos correctamente';
      this.modalType = 'warning';
      this.showModal = true;
      this.productForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.productForm.reset();
  }

  closeModal(): void {
    this.showModal = false;
  }
}
