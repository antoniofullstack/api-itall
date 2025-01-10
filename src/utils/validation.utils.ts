import { AppError } from '../middlewares/error.middleware';
import { CreateProductDTO } from '../types';

export class ValidationUtils {
  static validateProductData(data: Partial<CreateProductDTO>) {
    if (data.price !== undefined && data.price <= 0) {
      throw new AppError('Price must be greater than 0', 400);
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }
  }

  static validatePaginationParams(page?: number, limit?: number) {
    if (page !== undefined && page < 1) {
      throw new AppError('Page must be greater than 0', 400);
    }

    if (limit !== undefined && limit < 1) {
      throw new AppError('Limit must be greater than 0', 400);
    }
  }

  static validatePriceRange(minPrice?: number, maxPrice?: number) {
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new AppError('Minimum price cannot be greater than maximum price', 400);
    }
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
