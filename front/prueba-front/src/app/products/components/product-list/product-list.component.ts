import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchField: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  paginatedProducts: Product[] = [];
  openDropdownId: string | null = null;
  showDeleteModal = false;
  productToDelete: Product | null = null;

  constructor(
    private readonly productsService: ProductsService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.products = [];
    this.filteredProducts = [];
    this.paginatedProducts = [];
  }

  /* Paginacion */
  onPageSizeChange(size: string): void {
    this.pageSize = parseInt(size);
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  private updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  /* F1 y F2 */
  private loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.updatePaginatedProducts();
        this.cdr.markForCheck();
      },
    });
  }

  getInitials(name: string): string {
    return name.toUpperCase().slice(0, 2);
  }

  onSearchChange(term: string): void {
    this.searchField = term;
    if (!this.searchField.trim()) {
      this.filteredProducts = this.products;
    } else {
      const searchLower = this.searchField.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower),
      );
    }
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  /* F4 */
  navigateToAddProduct(): void {
    this.router.navigate(['/products/add']);
  }

  /* F5 */
  toggleDropdown(productId: string): void {
    this.openDropdownId = this.openDropdownId === productId ? null : productId;
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
    this.openDropdownId = null;
  }

  /* F6 */
  deleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
    this.openDropdownId = null;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.productsService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeDeleteModal();
        },
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }
}
