import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductsService } from '../../services/products.service';
import { Product, CreateProductResponse } from '../../models/product.model';

describe('ProductForm', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductsService: Partial<ProductsService>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockProductsService = {
      verifyProductId: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      getProductById: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    fixture.detectChanges();
    expect(component.isEditMode).toBeFalsy();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')?.enabled).toBeTruthy();
  });

  it('should initialize form in edit mode when id is provided', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('123');
    (mockProductsService.getProductById as jest.Mock).mockReturnValue(
      of({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01',
      }),
    );

    fixture.detectChanges();

    expect(component.isEditMode).toBeTruthy();
    expect(component.productId).toBe('123');
  });

  it('should validate required fields', () => {
    fixture.detectChanges();

    component.productForm.patchValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });

    expect(component.productForm.invalid).toBeTruthy();
    expect(component.productForm.get('id')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('name')?.hasError('required')).toBeTruthy();
  });

  it('should validate field lengths', () => {
    fixture.detectChanges();

    component.productForm.patchValue({
      id: 'ab', // too short
      name: 'test', // too short
      description: 'short', // too short
    });

    expect(component.productForm.get('id')?.hasError('minlength')).toBeTruthy();
    expect(component.productForm.get('name')?.hasError('minlength')).toBeTruthy();
    expect(component.productForm.get('description')?.hasError('minlength')).toBeTruthy();
  });

  it('should check if field is invalid', () => {
    fixture.detectChanges();

    const field = component.productForm.get('name');
    field?.markAsTouched();
    field?.setValue('');

    expect(component.isFieldInvalid('name')).toBeTruthy();
  });

  it('should set revision date when release date changes', () => {
    fixture.detectChanges();

    const releaseDate = '2024-01-01';
    component.productForm.get('date_release')?.setValue(releaseDate);

    const expectedRevisionDate = '2025-01-01';
    expect(component.productForm.get('date_revision')?.value).toBe(expectedRevisionDate);
  });

  it('should validate date is not in the past', () => {
    fixture.detectChanges();

    const pastDate = '2020-01-01';
    component.productForm.get('date_release')?.setValue(pastDate);

    expect(component.productForm.get('date_release')?.hasError('invalidDate')).toBeTruthy();
  });

  it('should create product on valid form submission', () => {
    (mockProductsService.createProduct as jest.Mock).mockReturnValue(
      of({ message: 'Product created successfully' } as CreateProductResponse),
    );

    fixture.detectChanges();

    // Spy on the createRegister method directly
    jest.spyOn(component, 'createRegister');
    
    // Mock the form as valid
    Object.defineProperty(component.productForm, 'valid', {
      get: () => true
    });
    
    component.onSubmit();

    expect(component.createRegister).toHaveBeenCalled();
  });

  it('should show error modal on invalid form submission', () => {
    fixture.detectChanges();
    
    // Mock the form as invalid
    Object.defineProperty(component.productForm, 'valid', {
      get: () => false
    });
    jest.spyOn(component.productForm, 'markAllAsTouched');
    
    component.onSubmit();

    expect(component.productForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.showModal).toBeTruthy();
    expect(component.modalType).toBe('warning');
    expect(component.modalTitle).toBe('Formulario inválido');
  });

  it('should call createProduct service', () => {
    (mockProductsService.createProduct as jest.Mock).mockReturnValue(
      of({ message: 'Product created successfully' } as CreateProductResponse),
    );

    fixture.detectChanges();

    // Test the createRegister method directly
    component.createRegister();

    expect(mockProductsService.createProduct).toHaveBeenCalled();
    expect(component.showModal).toBeTruthy();
    expect(component.modalType).toBe('success');
  });

  it('should reset form in create mode', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // Disable async validator for testing
    component.productForm.get('id')?.clearAsyncValidators();

    component.productForm.patchValue({
      id: 'test123',
      name: 'Test Product',
    });

    component.onReset();

    expect(component.productForm.get('id')?.value).toBeNull();
    expect(component.productForm.get('name')?.value).toBeNull();
  });

  it('should close modal', () => {
    component.showModal = true;

    component.closeModal();

    expect(component.showModal).toBeFalsy();
  });

  it('should test createRegister method directly', () => {
    (mockProductsService.createProduct as jest.Mock).mockReturnValue(
      of({ message: 'Product created successfully' } as CreateProductResponse),
    );

    fixture.detectChanges();
    
    // Test the method directly without form validation
    component.createRegister();

    expect(mockProductsService.createProduct).toHaveBeenCalled();
    expect(component.showModal).toBeTruthy();
    expect(component.modalType).toBe('success');
  });
});
