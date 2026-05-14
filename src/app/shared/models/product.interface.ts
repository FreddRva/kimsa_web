export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  categoryId: string;
  categoryName?: string;
  isAvailable: boolean;
  station?: string;
  components?: { name: string; station: string }[];
  variations?: any[];
  isDeleted?: boolean;
  createdAt?: any;
  updatedAt?: any;
}
