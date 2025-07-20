import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Statistics Routes', () => {
  let authToken: string;
  let customerId: string;

  beforeEach(async () => {
    // Clean up any existing test data first (order matters due to foreign keys)
    await prisma.sale.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = await prisma.user.create({
      data: {
        email: `test-statistics-${Date.now()}@example.com`,
        password: hashedPassword,
        name: 'Test User'
      }
    });

    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env['JWT_SECRET'] || 'test-secret',
      { expiresIn: '1h' }
    );

    // Create a single test customer
    const customer = await prisma.customer.create({
      data: {
        name: 'Test Customer',
        email: `test-${Date.now()}@example.com`,
        birthDate: new Date('1990-01-01')
      }
    });
    customerId = customer.id;

    // Create a single test sale
    await prisma.sale.create({
      data: { 
        customerId: customerId, 
        amount: 100, 
        date: new Date('2024-01-01') 
      }
    });
  });

  afterEach(async () => {
    // Clean up test data (order matters due to foreign keys)
    await prisma.sale.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/statistics/daily-sales', () => {
    it('should return daily sales statistics', async () => {
      const response = await request(app)
        .get('/api/statistics/daily-sales')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // API retorna dados diretos, sem wrapper success
      expect(Array.isArray(response.body)).toBe(true);

      // Should have data for at least one day
      expect(response.body.length).toBeGreaterThan(0);

      // Check structure of each daily sale record
      const firstRecord = response.body[0];
      expect(firstRecord).toHaveProperty('date');
      expect(firstRecord).toHaveProperty('total');
      expect(typeof firstRecord.total).toBe('number');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/statistics/daily-sales')
        .expect(401);
    });
  });

  describe('GET /api/statistics/top-customers', () => {
    it('should return top customers statistics', async () => {
      const response = await request(app)
        .get('/api/statistics/top-customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // API retorna dados transformados, sem wrapper success
      expect(response.body).toBeDefined();

      // Check for the three required metrics
      expect(response.body).toHaveProperty('highestVolume');
      expect(response.body).toHaveProperty('highestAverage');
      expect(response.body).toHaveProperty('highestFrequency');

      // Validate highest volume customer
      const highestVolume = response.body.highestVolume;
      expect(highestVolume).toBeDefined();
      expect(highestVolume).toHaveProperty('clientId'); // API usa clientId, não customerId
      expect(highestVolume).toHaveProperty('name');
      expect(highestVolume).toHaveProperty('total');
      expect(typeof highestVolume.total).toBe('number');

      // Validate highest average customer
      const highestAverage = response.body.highestAverage;
      expect(highestAverage).toBeDefined();
      expect(highestAverage).toHaveProperty('clientId');
      expect(highestAverage).toHaveProperty('name');
      expect(highestAverage).toHaveProperty('average');
      expect(typeof highestAverage.average).toBe('number');

      // Validate highest frequency customer
      const highestFrequency = response.body.highestFrequency;
      expect(highestFrequency).toBeDefined();
      expect(highestFrequency).toHaveProperty('clientId');
      expect(highestFrequency).toHaveProperty('name');
      expect(highestFrequency).toHaveProperty('frequency');
      expect(typeof highestFrequency.frequency).toBe('number');
    });

    it('should return correct data for single customer', async () => {
      const response = await request(app)
        .get('/api/statistics/top-customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const highestVolume = response.body.highestVolume;
      const highestAverage = response.body.highestAverage;
      const highestFrequency = response.body.highestFrequency;

      // All should point to the same customer since there's only one
      expect(highestVolume.clientId).toBe(customerId);
      expect(highestAverage.clientId).toBe(customerId);
      expect(highestFrequency.clientId).toBe(customerId);

      // All should have the same name
      expect(highestVolume.name).toBe('Test Customer');
      expect(highestAverage.name).toBe('Test Customer');
      expect(highestFrequency.name).toBe('Test Customer');

      // Values should be correct
      expect(highestVolume.total).toBe(100); // Single sale of 100
      expect(highestAverage.average).toBe(100); // Single sale of 100
      expect(highestFrequency.frequency).toBe(1); // Single unique day
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/statistics/top-customers')
        .expect(401);
    });
  });
}); 