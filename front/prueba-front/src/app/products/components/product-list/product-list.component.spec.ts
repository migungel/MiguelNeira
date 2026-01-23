import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { SharedModule } from '../../../shared/shared-module';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductsService: Partial<ProductsService>;
  let mockRouter: Partial<Router>;

  const mockProducts: Product[] = [
    {
      id: 'test1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      logo: 'test-logo1.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: 'test2',
      name: 'Another Product',
      description: 'Another Description',
      logo: 'test-logo2.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    }
  ];

  beforeEach(async () => {
    mockProductsService = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Product deleted' }))
    };
    
    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [SharedModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    fixture.detectChanges();
    
    expect(mockProductsService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
    expect(component.paginatedProducts.length).toBeGreaterThan(0);
  });

  it('should initialize with default values', () => {
    expect(component.products).toEqual([]);
    expect(component.filteredProducts).toEqual([]);
    expect(component.searchField).toBe('');
    expect(component.pageSize).toBe(5);
    expect(component.currentPage).toBe(1);
    expect(component.showDeleteModal).toBe(false);
    expect(component.productToDelete).toBeNull();
  });

  it('should get initials from product name', () => {
    const initials = component.getInitials('Test Product');
    expect(initials).toBe('TE');
  });

  it('should filter products by search term', () => {
    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    
    component.onSearchChange('Test');
    
    expect(component.searchField).toBe('Test');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Test Product 1');
    expect(component.currentPage).toBe(1);
  });

  it('should show all products when search is empty', () => {
    component.products = mockProducts;
    component.filteredProducts = [];
    
    component.onSearchChange('');
    
    expect(component.filteredProducts).toEqual(mockProducts);
  });

  it('should filter products by description', () => {
    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    
    component.onSearchChange('Another');
    
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].description).toBe('Another Description');
  });

  it('should change page size and reset to first page', () => {
    component.filteredProducts = mockProducts;
    component.currentPage = 2;
    
    component.onPageSizeChange('10');
    
    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('should calculate total pages correctly', () => {
    component.filteredProducts = mockProducts;
    component.pageSize = 1;
    
    expect(component.totalPages).toBe(2);
    
    component.pageSize = 5;
    expect(component.totalPages).toBe(1);
  });

  it('should go to specific page', () => {
    component.filteredProducts = mockProducts;
    component.pageSize = 1;
    
    component.goToPage(2);
    
    expect(component.currentPage).toBe(2);
    expect(component.paginatedProducts[0]).toEqual(mockProducts[1]);
  });

  it('should navigate to add product', () => {
    component.navigateToAddProduct();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/add']);
  });

  it('should toggle dropdown', () => {
    const productId = 'test1';
    
    component.toggleDropdown(productId);
    expect(component.openDropdownId).toBe(productId);
    
    component.toggleDropdown(productId);
    expect(component.openDropdownId).toBeNull();
  });

  it('should edit product and close dropdown', () => {
    const product = mockProducts[0];
    component.openDropdownId = product.id;
    
    component.editProduct(product);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/edit', product.id]);
    expect(component.openDropdownId).toBeNull();
  });

  it('should open delete modal', () => {
    const product = mockProducts[0];
    component.openDropdownId = product.id;
    
    component.deleteProduct(product);
    
    expect(component.productToDelete).toBe(product);
    expect(component.showDeleteModal).toBe(true);
    expect(component.openDropdownId).toBeNull();
  });

  it('should close delete modal', () => {
    component.showDeleteModal = true;
    component.productToDelete = mockProducts[0];
    
    component.closeDeleteModal();
    
    expect(component.showDeleteModal).toBe(false);
    expect(component.productToDelete).toBeNull();
  });

  it('should confirm delete and reload products', () => {
    const product = mockProducts[0];
    component.productToDelete = product;
    component.showDeleteModal = true;
    
    component.confirmDelete();
    
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(mockProductsService.getProducts).toHaveBeenCalled();
  });

  it('should handle delete error', () => {
    const product = mockProducts[0];
    component.productToDelete = product;
    component.showDeleteModal = true;
    
    (mockProductsService.deleteProduct as jest.Mock).mockReturnValue(
      throwError('Delete failed')
    );
    
    component.confirmDelete();
    
    expect(component.showDeleteModal).toBe(false);
    expect(component.productToDelete).toBeNull();
  });

  it('should not delete if no product selected', () => {
    component.productToDelete = null;
    
    component.confirmDelete();
    
    expect(mockProductsService.deleteProduct).not.toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    component.products = mockProducts;
    component.filteredProducts = mockProducts;
    component.paginatedProducts = mockProducts;
    
    component.ngOnDestroy();
    
    expect(component.products).toEqual([]);
    expect(component.filteredProducts).toEqual([]);
    expect(component.paginatedProducts).toEqual([]);
  });

  it('should update paginated products correctly', () => {
    component.filteredProducts = mockProducts;
    component.pageSize = 1;
    component.currentPage = 1;
    
    // Call private method through public method
    component.goToPage(1);
    
    expect(component.paginatedProducts.length).toBe(1);
    expect(component.paginatedProducts[0]).toEqual(mockProducts[0]);
  });
});
