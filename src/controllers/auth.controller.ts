import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middlewares/error.middleware';
import { QueryFailedError } from 'typeorm';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { name, email, password } = req.body;
      const result = await this.authService.register({ name, email, password });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      // Handle duplicate email error from database
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = await this.authService.getProfile(req.user.id);
      return res.json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}
