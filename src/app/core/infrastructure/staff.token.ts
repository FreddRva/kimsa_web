import { InjectionToken } from '@angular/core';
import { StaffRepositoryPort } from '../domain/staff/staff.repository.port';

export const STAFF_REPOSITORY_TOKEN = new InjectionToken<StaffRepositoryPort>('StaffRepositoryPort');
