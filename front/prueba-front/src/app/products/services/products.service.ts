import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductResponse, Product, ProductsResponse } from '../models/product.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>(`${this.baseUrl}/bp/products`)
      .pipe(map((response) => response.data));
  }

  createProduct(product: Product): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(`${this.baseUrl}/bp/products`, product);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/bp/products/${id}`);
  }

  updateProduct(id: string, product: Omit<Product, 'id'>): Observable<CreateProductResponse> {
    return this.http.put<CreateProductResponse>(`${this.baseUrl}/bp/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/bp/products/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/bp/products/verification/${id}`);
  }
}
