import request from 'supertest';
import { createApp } from '../src/app';
import { AppDataSource } from '../src/config/ormconfig';
import { truncateTables } from './helpers/database';

describe('Product Routes', () => {
  let app: any;
  let authToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = await createApp();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    await truncateTables();
    const user = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    // Primeiro criar o usuário
    await request(app).post('/auth/register').send(user);
    
    // Depois fazer login
    const loginResponse = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password
    });
    
    if (!loginResponse.body.data || !loginResponse.body.data.token) {
      console.error('Login response does not contain token:', loginResponse.body);
      throw new Error('Login failed, token not found');
    }
    authToken = loginResponse.body.data.token;
  });

  describe('POST /products', () => {
    it('should fail when creating product without auth token', async () => {
      const response = await request(app).post('/products').send({
        name: 'Test Product',
        price: 100
      });
      expect(response.status).toBe(401);
    });

    it('should create a product with valid auth token', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 100,
          category: 'Test Category',
          description: 'Test Description',
          stock: 10
        });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should fail when creating product with missing required fields', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product'
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when creating product with invalid price', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: -100,
          category: 'Test Category',
          description: 'Test Description',
          stock: 10
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when creating product with invalid stock', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 100,
          category: 'Test Category',
          description: 'Test Description',
          stock: -1
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /products', () => {
    beforeEach(async () => {
      // Criar alguns produtos para testar
      const products = [
        {
          name: 'Product 1',
          price: 100,
          category: 'Category A',
          description: 'Description 1',
          stock: 10
        },
        {
          name: 'Product 2',
          price: 200,
          category: 'Category B',
          description: 'Description 2',
          stock: 20
        },
        {
          name: 'Product 3',
          price: 300,
          category: 'Category A',
          description: 'Description 3',
          stock: 30
        }
      ];

      for (const product of products) {
        await request(app)
          .post('/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send(product);
      }
    });

    it('should get all products without filters', async () => {
      const response = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(3);
      expect(response.body.data.total).toBe(3);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/products?category=Category A')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.items.every((p: any) => p.category === 'Category A')).toBe(true);
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/products?minPrice=150&maxPrice=250')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].price).toBe(200);
    });

    it('should paginate products correctly', async () => {
      const response = await request(app)
        .get('/products?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.totalPages).toBe(2);
    });

    it('should handle invalid page number', async () => {
      const response = await request(app)
        .get('/products?page=0')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle invalid price range', async () => {
      const response = await request(app)
        .get('/products?minPrice=200&maxPrice=100')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 100,
          category: 'Test Category',
          description: 'Test Description',
          stock: 10
        });
      productId = createResponse.body.data.id;
    });

    it('should update a product successfully', async () => {
      const response = await request(app)
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Product',
          price: 200
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Product');
      expect(response.body.data.price).toBe(200);
    });

    it('should fail when updating non-existent product', async () => {
      const response = await request(app)
        .put('/products/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Product',
          price: 200
        });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail when updating with invalid data', async () => {
      const response = await request(app)
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          price: -100
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when updating without auth token', async () => {
      const response = await request(app)
        .put(`/products/${productId}`)
        .send({
          name: 'Updated Product'
        });
      
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 100,
          category: 'Test Category',
          description: 'Test Description',
          stock: 10
        });
      productId = createResponse.body.data.id;
    });

    it('should delete a product successfully', async () => {
      const response = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should fail when deleting non-existent product', async () => {
      const response = await request(app)
        .delete('/products/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail when deleting without auth token', async () => {
      const response = await request(app)
        .delete(`/products/${productId}`);
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 100,
          category: 'Test Category',
          description: 'Test Description',
          stock: 10
        });
      
      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data).toHaveProperty('id');
      productId = createResponse.body.data.id;
    });

    it('should get a product by id', async () => {
      const response = await request(app)
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(productId);
      expect(response.body.data.name).toBe('Test Product');
      expect(response.body.data.price).toBe(100);
      expect(response.body.data.category).toBe('Test Category');
      expect(response.body.data.description).toBe('Test Description');
      expect(response.body.data.stock).toBe(10);
    });

    it('should fail when getting non-existent product', async () => {
      const nonExistentId = '00000000-0000-4000-a000-000000000000';
      const response = await request(app)
        .get(`/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });

    it('should fail when getting product with invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';
      const response = await request(app)
        .get(`/products/${invalidId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid product ID format');
    });

    it('should fail when getting product without auth token', async () => {
      const response = await request(app)
        .get(`/products/${productId}`);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorized');
    });
  });
});