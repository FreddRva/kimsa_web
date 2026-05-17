import { InjectionToken } from '@angular/core';
import { ProductRepositoryPort } from '../domain/product/product.repository.port';

export const PRODUCT_REPOSITORY_TOKEN = new InjectionToken<ProductRepositoryPort>('ProductRepositoryPort');
