import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;
  let module: AppRoutingModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRoutingModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    module = new AppRoutingModule();
  });

  it('should create', () => {
    expect(module).toBeTruthy();
  });

  it('should have products route configured', () => {
    const routes = router.config;
    const productsRoute = routes.find(route => route.path === 'products');
    expect(productsRoute).toBeDefined();
    expect(productsRoute?.loadChildren).toBeDefined();
  });

  it('should have default redirect route configured', () => {
    const routes = router.config;
    const defaultRoute = routes.find(route => route.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute?.redirectTo).toBe('/products');
    expect(defaultRoute?.pathMatch).toBe('full');
  });
});