import { PaginationParams } from './pagination';

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductFilters extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
