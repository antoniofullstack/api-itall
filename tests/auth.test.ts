import request from 'supertest';
import { createApp } from '../src/app';
import { AppDataSource } from '../src/config/ormconfig';
import { truncateTables } from './helpers/database';

describe('Auth Routes', () => {
  let app: any;

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
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User 1',
          email: 'test1@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('test1@example.com');
    });

    it('should not register a user with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'password123'
        });

      // Second registration with same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Another User',
          email: 'test2@example.com',
          password: 'password456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already exists');
    });

    it('should not register a user with invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email');
    });

    it('should not register a user with short password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password must be at least 6 characters long');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User 3',
          email: 'test3@example.com',
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test3@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test3@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should not login with missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test3@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is required');
    });

    it('should not login with missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email');
    });
  });
});
