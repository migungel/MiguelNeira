import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing-module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductListComponent, ProductCardComponent, ProductFormComponent],
  imports: [CommonModule, ProductsRoutingModule, ReactiveFormsModule],
})
export class ProductsModule {}
