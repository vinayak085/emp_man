import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import Employee from '../models/Employee.js';

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Employee.deleteMany({});
});

describe('Employee Management System - Backend API Tests', () => {
  describe('POST /api/employees (Create Employee)', () => {
    it('should create an employee successfully with valid data', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({
          name: 'Sarah Connor',
          email: 'sarah.connor@example.com',
          designation: 'Senior DevOps Engineer',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('Sarah Connor');
      expect(res.body.data.email).toBe('sarah.connor@example.com');
      expect(res.body.data.designation).toBe('Senior DevOps Engineer');
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');
    });

    it('should reject creation when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({
          name: 'Incomplete Person',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject creation with an invalid email format', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'not-an-email',
          designation: 'Frontend Developer',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/valid email/i);
    });

    it('should reject creation with duplicate email address', async () => {
      await Employee.create({
        name: 'First User',
        email: 'duplicate@example.com',
        designation: 'QA Tester',
      });

      const res = await request(app)
        .post('/api/employees')
        .send({
          name: 'Second User',
          email: 'duplicate@example.com',
          designation: 'Backend Developer',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('GET /api/employees (List, Pagination & Search)', () => {
    beforeEach(async () => {
      await Employee.insertMany([
        { name: 'Alice Smith', email: 'alice@example.com', designation: 'Software Engineer' },
        { name: 'Bob Johnson', email: 'bob@example.com', designation: 'Product Manager' },
        { name: 'Charlie Brown', email: 'charlie@example.com', designation: 'UI/UX Designer' },
        { name: 'Diana Prince', email: 'diana@example.com', designation: 'Software Engineer' },
        { name: 'Evan Wright', email: 'evan@example.com', designation: 'DevOps Engineer' },
      ]);
    });

    it('should return paginated list of employees', async () => {
      const res = await request(app).get('/api/employees?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.totalRecords).toBe(5);
      expect(res.body.pagination.totalPages).toBe(3);
      expect(res.body.pagination.currentPage).toBe(1);
      expect(res.body.pagination.hasNextPage).toBe(true);
      expect(res.body.pagination.hasPrevPage).toBe(false);
    });

    it('should search employees by name case-insensitively', async () => {
      const res = await request(app).get('/api/employees?search=alice');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Alice Smith');
    });

    it('should search employees by designation', async () => {
      const res = await request(app).get('/api/employees?search=Software Engineer');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should return empty results when no employees match search', async () => {
      const res = await request(app).get('/api/employees?search=NonExistentQuery');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
      expect(res.body.pagination.totalRecords).toBe(0);
    });
  });

  describe('GET /api/employees/:id (Get Single Employee)', () => {
    it('should return employee details for a valid ID', async () => {
      const employee = await Employee.create({
        name: 'Bruce Wayne',
        email: 'bruce@wayne.com',
        designation: 'CEO',
      });

      const res = await request(app).get(`/api/employees/${employee._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Bruce Wayne');
      expect(res.body.data.email).toBe('bruce@wayne.com');
    });

    it('should return 400 for an invalid ObjectId format', async () => {
      const res = await request(app).get('/api/employees/invalid-mongo-id-123');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid employee id format/i);
    });

    it('should return 404 for a non-existent employee ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/employees/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Employee not found');
    });
  });

  describe('PUT /api/employees/:id (Update Employee)', () => {
    it('should update employee successfully', async () => {
      const employee = await Employee.create({
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        designation: 'Reporter',
      });

      const res = await request(app)
        .put(`/api/employees/${employee._id}`)
        .send({
          name: 'Clark Kent (Superman)',
          email: 'clark.kent@dailyplanet.com',
          designation: 'Senior Investigative Reporter',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Clark Kent (Superman)');
      expect(res.body.data.designation).toBe('Senior Investigative Reporter');
    });

    it('should prevent updating email to an existing employee email', async () => {
      await Employee.create({
        name: 'User One',
        email: 'user1@example.com',
        designation: 'Developer',
      });

      const userTwo = await Employee.create({
        name: 'User Two',
        email: 'user2@example.com',
        designation: 'Designer',
      });

      const res = await request(app)
        .put(`/api/employees/${userTwo._id}`)
        .send({
          name: 'User Two Renamed',
          email: 'user1@example.com', // Duplicate!
          designation: 'Lead Designer',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already assigned/i);
    });
  });

  describe('DELETE /api/employees/:id (Delete Employee)', () => {
    it('should delete employee successfully', async () => {
      const employee = await Employee.create({
        name: 'Temporary User',
        email: 'temp@example.com',
        designation: 'Intern',
      });

      const res = await request(app).delete(`/api/employees/${employee._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Employee deleted successfully');

      const checkInDb = await Employee.findById(employee._id);
      expect(checkInDb).toBeNull();
    });

    it('should return 404 when deleting a non-existent employee', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/employees/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
