import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductResponse, Product, ProductsResponse } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = 'http://localhost:3002';

  constructor(private http: HttpClient) {}

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
}
