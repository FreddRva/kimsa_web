import { InjectionToken } from '@angular/core';
import { OrderRepositoryPort } from '../domain/order/order.repository.port';

export const ORDER_REPOSITORY_TOKEN = new InjectionToken<OrderRepositoryPort>('OrderRepositoryPort');
