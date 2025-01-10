import { Repository } from 'typeorm';
import { Product } from '../models/Product';
import { AppDataSource } from '../config/ormconfig';
import { ProductFilters, CreateProductDTO, UpdateProductDTO, PaginatedResponse } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../config/constants';
import { ValidationUtils } from '../utils/validation.utils';

export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    ValidationUtils.validateProductData(data);
    const product = this.productRepository.create(data);
    await this.productRepository.save(product);
    return product;
  }

  async uploadProductImage(id: string, imageUrl: string): Promise<Product> {
    const product = await this.getProductById(id);
    product.imageUrl = imageUrl;
    await this.productRepository.save(product);
    return product;
  }

  async getAllProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    ValidationUtils.validatePaginationParams(filters.page, filters.limit);
    ValidationUtils.validatePriceRange(filters.minPrice, filters.maxPrice);

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filters.category) {
      queryBuilder.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getProductById(id: string): Promise<Product> {
    try {
      if (!ValidationUtils.isValidUUID(id)) {
        throw new AppError('Invalid product ID format', 400);
      }

      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
      }
      return product;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
    ValidationUtils.validateProductData(data);
    const product = await this.getProductById(id);
    Object.assign(product, data);
    await this.productRepository.save(product);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
  }
}
