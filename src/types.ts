export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
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

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface AuthCredentialsDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
