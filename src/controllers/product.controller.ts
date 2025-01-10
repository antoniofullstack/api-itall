import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { AppError } from '../middlewares/error.middleware';
import { ValidationUtils } from '../utils/validation.utils';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, category, stock } = req.body;
      
      if (!name || !price || !category || stock === undefined) {
        throw new AppError('Missing required fields', 400);
      }

      const product = await this.productService.createProduct({
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock)
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const { category, minPrice, maxPrice, page, limit } = req.query;
      const filters = {
        category: category as string | undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
      };

      const paginatedProducts = await this.productService.getAllProducts(filters);
      return res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: {
          items: paginatedProducts.items.map(product => ({
            ...product,
            price: Number(product.price)
          })),
          total: paginatedProducts.total,
          page: paginatedProducts.page,
          limit: paginatedProducts.limit,
          totalPages: paginatedProducts.totalPages
        }
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Validate UUID format
      if (!ValidationUtils.isValidUUID(id)) {
        throw new AppError('Invalid product ID format', 400);
      }

      const product = await this.productService.getProductById(id);

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      return res.json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded.', 400);
      }

      const imageUrl = req.file.filename;
      const product = await this.productService.uploadProductImage(req.params.id, imageUrl);

      return res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: product
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);

      return res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
