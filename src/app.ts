import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/ormconfig';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middlewares/error.middleware';
import { specs } from './config/swagger';

export const createApp = async () => {
  const app = express();

  // Initialize database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);

  // Error handling middleware
  app.use(errorHandler);

  return app;
};
