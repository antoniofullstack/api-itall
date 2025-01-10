export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface AuthCredentialsDTO {
  email: string;
  password: string;
}

export interface RegisterUserDTO extends AuthCredentialsDTO {
  name: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
