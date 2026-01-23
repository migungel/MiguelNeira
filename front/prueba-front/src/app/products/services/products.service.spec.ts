import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product, ProductsResponse, CreateProductResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  const mockProduct: Product = {
    id: 'test123',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01',
  };

  const mockProducts: Product[] = [mockProduct];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockResponse: ProductsResponse = { data: mockProducts };

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('test123');
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create product', () => {
    const mockResponse: CreateProductResponse = {
      message: 'Product created successfully',
      data: mockProduct,
    };

    service.createProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Product created successfully');
      expect(response.data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('should get product by id', () => {
    const productId = 'test123';

    service.getProductById(productId).subscribe((product) => {
      expect(product).toEqual(mockProduct);
      expect(product.id).toBe(productId);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should update product', () => {
    const productId = 'test123';
    const updateData = {
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01',
    };
    const mockResponse: CreateProductResponse = {
      message: 'Product updated successfully',
      data: { ...updateData, id: productId },
    };

    service.updateProduct(productId, updateData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Product updated successfully');
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should delete product', () => {
    const productId = 'test123';
    const mockResponse = { message: 'Product deleted successfully' };

    service.deleteProduct(productId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Product deleted successfully');
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should verify product id', () => {
    const productId = 'test123';
    const mockResponse = true;

    service.verifyProductId(productId).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products/verification/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should verify product id returns false when not exists', () => {
    const productId = 'nonexistent';
    const mockResponse = false;

    service.verifyProductId(productId).subscribe((exists) => {
      expect(exists).toBe(false);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products/verification/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    const errorMessage = 'Server error';

    service.getProducts().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
