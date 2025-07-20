import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Customer Routes', () => {
  let authToken: string;

  beforeAll(async () => {
    // Clean up any existing test data first
    await prisma.sale.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = await prisma.user.create({
      data: {
        email: `test-customers-${Date.now()}@example.com`,
        password: hashedPassword,
        name: 'Test User'
      }
    });

    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env['JWT_SECRET'] || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.sale.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/customers', () => {
    it('should create a new customer with valid data', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        birthDate: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(customerData.name);
      expect(response.body.data.email).toBe(customerData.email);
      expect(response.body.data.birthDate).toBe(customerData.birthDate);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email',
        birthDate: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const customerData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        birthDate: '1995-05-15'
      };

      await request(app)
        .post('/api/customers')
        .send(customerData)
        .expect(401);
    });
  });

  describe('GET /api/customers', () => {
    beforeEach(async () => {
      // Clean up existing customers first to avoid unique constraint issues
      await prisma.customer.deleteMany();
      
      // Create test customers for filtering tests with unique emails
      await prisma.customer.createMany({
        data: [
          {
            name: 'Alice Johnson',
            email: `alice.johnson-${Date.now()}@example.com`,
            birthDate: new Date('1990-01-01')
          },
          {
            name: 'Bob Smith',
            email: `bob.smith-${Date.now()}@example.com`,
            birthDate: new Date('1985-05-15')
          },
          {
            name: 'Carol Davis',
            email: `carol.davis-${Date.now()}@example.com`,
            birthDate: new Date('1992-12-20')
          }
        ]
      });
    });

    it('should return list of customers', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // API retorna dados diretos do serviço, sem wrapper success
      expect(response.body.data).toBeDefined();
      expect(response.body.data.clientes).toBeDefined();
      expect(Array.isArray(response.body.data.clientes)).toBe(true);
    });

    it('should filter customers by name', async () => {
      const response = await request(app)
        .get('/api/customers?name=Alice')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.clientes).toBeDefined();
      expect(response.body.data.clientes.length).toBeGreaterThan(0);
      
      // Check if all returned customers contain 'Alice' in their name
      response.body.data.clientes.forEach((customer: any) => {
        expect(customer.info.nomeCompleto.toLowerCase()).toContain('alice');
      });
    });

    it('should filter customers by email', async () => {
      const response = await request(app)
        .get('/api/customers?email=alice.johnson')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.clientes).toBeDefined();
      expect(response.body.data.clientes.length).toBeGreaterThan(0);
      
      // Check if all returned customers contain 'alice.johnson' in their email
      response.body.data.clientes.forEach((customer: any) => {
        expect(customer.info.detalhes.email.toLowerCase()).toContain('alice.johnson');
      });
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/customers')
        .expect(401);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return customer by id', async () => {
      // Create a new customer for this test
      const customer = await prisma.customer.create({
        data: {
          name: 'Test Customer for Get',
          email: `test-get-${Date.now()}@example.com`,
          birthDate: new Date('1990-01-01')
        }
      });

      const response = await request(app)
        .get(`/api/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(customer.id);
    });

    it('should return 404 for non-existent customer', async () => {
      const nonExistentId = 'non-existent-id';

      const response = await request(app)
        .get(`/api/customers/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const nonExistentId = 'non-existent-id';
      await request(app)
        .get(`/api/customers/${nonExistentId}`)
        .expect(401);
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update customer with valid data', async () => {
      // Create a new customer for this test
      const customer = await prisma.customer.create({
        data: {
          name: 'Test Customer for Update',
          email: `test-update-${Date.now()}@example.com`,
          birthDate: new Date('1990-01-01')
        }
      });

      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        birthDate: '1990-02-02'
      };

      const response = await request(app)
        .put(`/api/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
      expect(response.body.data.birthDate).toBe(updateData.birthDate);
    });

    it('should return 400 for invalid data', async () => {
      // Create a new customer for this test
      const customer = await prisma.customer.create({
        data: {
          name: 'Test Customer for Invalid Update',
          email: `test-invalid-update-${Date.now()}@example.com`,
          birthDate: new Date('1990-01-01')
        }
      });

      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email'
      };

      const response = await request(app)
        .put(`/api/customers/${customer.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 for non-existent customer', async () => {
      const nonExistentId = 'non-existent-id';
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/api/customers/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const nonExistentId = 'non-existent-id';
      const updateData = {
        name: 'Unauthorized Update',
        email: 'unauthorized@example.com'
      };

      await request(app)
        .put(`/api/customers/${nonExistentId}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should delete customer', async () => {
      // Create a new customer specifically for deletion test
      const customerToDelete = await prisma.customer.create({
        data: {
          name: 'Customer To Delete',
          email: `delete.me-${Date.now()}@example.com`,
          birthDate: new Date('1990-01-01')
        }
      });

      // Verify customer exists before deletion
      const customerBeforeDelete = await prisma.customer.findUnique({
        where: { id: customerToDelete.id }
      });
      expect(customerBeforeDelete).toBeDefined();

      const response = await request(app)
        .delete(`/api/customers/${customerToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();

      // Verify customer was actually deleted
      const customerAfterDelete = await prisma.customer.findUnique({
        where: { id: customerToDelete.id }
      });
      expect(customerAfterDelete).toBeNull();
    });

    it('should return 404 for non-existent customer', async () => {
      const nonExistentId = 'non-existent-id';

      const response = await request(app)
        .delete(`/api/customers/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const nonExistentId = 'non-existent-id';
      await request(app)
        .delete(`/api/customers/${nonExistentId}`)
        .expect(401);
    });
  });
}); 