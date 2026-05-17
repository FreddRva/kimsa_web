import { InjectionToken } from '@angular/core';
import { CategoryRepositoryPort } from '../domain/category/category.repository.port';

export const CATEGORY_REPOSITORY_TOKEN = new InjectionToken<CategoryRepositoryPort>('CategoryRepositoryPort');
