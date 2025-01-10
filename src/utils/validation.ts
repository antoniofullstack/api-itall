import { CreateProductDTO, UpdateProductDTO } from '../types';
import { AppError } from '../middlewares/error.middleware';

export class ValidationUtils {
  static validateProductData(data: CreateProductDTO | UpdateProductDTO) {
    if (data.price !== undefined && data.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }
  }

  static validatePaginationParams(page?: number, limit?: number) {
    if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
      throw new AppError('Page must be a positive integer', 400);
    }

    if (limit !== undefined && (limit < 1 || !Number.isInteger(limit))) {
      throw new AppError('Limit must be a positive integer', 400);
    }
  }

  static validatePriceRange(minPrice?: number, maxPrice?: number) {
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new AppError('Min price cannot be greater than max price', 400);
    }

    if ((minPrice !== undefined && minPrice < 0) || (maxPrice !== undefined && maxPrice < 0)) {
      throw new AppError('Price range cannot include negative values', 400);
    }
  }
}
