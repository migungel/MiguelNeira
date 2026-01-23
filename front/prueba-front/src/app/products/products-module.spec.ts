import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products-module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { SharedModule } from '../shared/shared-module';

describe('ProductsModule', () => {
  let module: ProductsModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        ReactiveFormsModule,
        SharedModule,
        ProductsModule
      ]
    }).compileComponents();

    module = new ProductsModule();
  });

  it('should create', () => {
    expect(module).toBeTruthy();
  });

  it('should declare ProductListComponent', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should declare ProductFormComponent', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should import required modules', () => {
    // Test that the module can be instantiated
    expect(module).toBeInstanceOf(ProductsModule);
  });
});