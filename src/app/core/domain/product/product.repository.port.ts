import { Observable } from 'rxjs';
import { Product } from './product.model';

export interface ProductRepositoryPort {
  getProducts(): Observable<Product[]>;
  addProduct(data: Partial<Product>): Promise<void>;
  updateProduct(id: string, data: Partial<Product>): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  updateProductStation(id: string, station: string): Promise<void>;
}
