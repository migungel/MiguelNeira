import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing-module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [ProductListComponent, ProductFormComponent],
  imports: [CommonModule, ProductsRoutingModule, ReactiveFormsModule, SharedModule],
})
export class ProductsModule {}
