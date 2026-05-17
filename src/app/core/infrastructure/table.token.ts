import { InjectionToken } from '@angular/core';
import { TableRepositoryPort } from '../domain/table/table.repository.port';

export const TABLE_REPOSITORY_TOKEN = new InjectionToken<TableRepositoryPort>('TableRepositoryPort');
