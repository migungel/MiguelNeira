import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing-module';
import { ProductList } from './components/product-list/product-list';
import { ProductCard } from './components/product-card/product-card';


@NgModule({
  declarations: [
    ProductList,
    ProductCard
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
