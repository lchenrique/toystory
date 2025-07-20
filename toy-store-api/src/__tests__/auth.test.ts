import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '../../generated/prisma';

// Set JWT_SECRET for tests
process.env['JWT_SECRET'] = 'your-super-secret-jwt-key-change-this-in-production-minimum-32-chars';

const prisma = new PrismaClient();

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.sale.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.sale.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: `test-register-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Create first user
      await request(app).post('/api/auth/register').send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUserEmail: string;

    beforeEach(async () => {
      // Create a test user
      testUserEmail = `login-${Date.now()}@example.com`;
      await request(app).post('/api/auth/register').send({
        email: testUserEmail,
        password: 'password123',
        name: 'Login User',
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: testUserEmail,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: testUserEmail,
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
}); 