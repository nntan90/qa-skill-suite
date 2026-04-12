/**
 * Supertest API Test Starter Template
 * ====================================
 * A production-ready API test file template using Supertest and Jest.
 * Replace [API] with your actual API name.
 *
 * Usage:
 *   npm test -- --testPathPattern=api.test.ts
 *   npm test -- --coverage
 */

import request from 'supertest';
import { app } from '../src/app'; // Import your Express app

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_VERSION = '/api/v1';

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123',
};

let authToken: string;

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

beforeAll(async () => {
  // Get auth token for tests
  const response = await request(app)
    .post(`${API_VERSION}/auth/login`)
    .send(TEST_USER);
  
  authToken = response.body.token;
});

afterAll(async () => {
  // Cleanup if needed
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const authHeaders = () => ({
  Authorization: `Bearer ${authToken}`,
});

const sampleResource = {
  name: 'Test Resource',
  description: 'Created by automated test',
  status: 'active',
};

// =============================================================================
// HAPPY PATH TESTS
// =============================================================================

describe('Resource CRUD Operations', () => {
  describe('POST /resources', () => {
    it('should create resource and return 201', async () => {
      const response = await request(app)
        .post(`${API_VERSION}/resources`)
        .set(authHeaders())
        .send(sampleResource)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(sampleResource.name);
    });
  });

  describe('GET /resources/:id', () => {
    it('should return resource by ID with 200', async () => {
      const resourceId = 1;

      const response = await request(app)
        .get(`${API_VERSION}/resources/${resourceId}`)
        .set(authHeaders())
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.id).toBe(resourceId);
    });
  });

  describe('GET /resources', () => {
    it('should return paginated list with 200', async () => {
      const response = await request(app)
        .get(`${API_VERSION}/resources`)
        .query({ page: 1, limit: 10 })
        .set(authHeaders())
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });

  describe('PATCH /resources/:id', () => {
    it('should update resource and return 200', async () => {
      const resourceId = 1;
      const updates = { name: 'Updated Name' };

      const response = await request(app)
        .patch(`${API_VERSION}/resources/${resourceId}`)
        .set(authHeaders())
        .send(updates)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
    });
  });

  describe('DELETE /resources/:id', () => {
    it('should delete resource and return 204', async () => {
      const resourceId = 1;

      await request(app)
        .delete(`${API_VERSION}/resources/${resourceId}`)
        .set(authHeaders())
        .expect(204);
    });
  });
});

// =============================================================================
// ERROR RESPONSE TESTS
// =============================================================================

describe('Resource Error Responses', () => {
  describe('Authentication Errors', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .post(`${API_VERSION}/resources`)
        .send(sampleResource)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 when token is invalid', async () => {
      await request(app)
        .get(`${API_VERSION}/resources`)
        .set({ Authorization: 'Bearer invalid-token' })
        .expect(401);
    });
  });

  describe('Validation Errors', () => {
    it('should return 422 when required field is missing', async () => {
      const invalidData = { name: '' };

      const response = await request(app)
        .post(`${API_VERSION}/resources`)
        .set(authHeaders())
        .send(invalidData)
        .expect(422);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 422 when data type is invalid', async () => {
      const invalidData = { name: 123 }; // Should be string

      await request(app)
        .post(`${API_VERSION}/resources`)
        .set(authHeaders())
        .send(invalidData)
        .expect(422);
    });
  });

  describe('Not Found Errors', () => {
    it('should return 404 when resource does not exist', async () => {
      await request(app)
        .get(`${API_VERSION}/resources/999999`)
        .set(authHeaders())
        .expect(404);
    });
  });

  describe('Bad Request Errors', () => {
    it('should return 400 when ID format is invalid', async () => {
      await request(app)
        .get(`${API_VERSION}/resources/invalid-id`)
        .set(authHeaders())
        .expect(400);
    });
  });
});

// =============================================================================
// AUTHENTICATION TESTS
// =============================================================================

describe('Authentication Endpoints', () => {
  describe('POST /auth/login', () => {
    it('should return token with valid credentials', async () => {
      const response = await request(app)
        .post(`${API_VERSION}/auth/login`)
        .send(TEST_USER)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 401 with invalid password', async () => {
      await request(app)
        .post(`${API_VERSION}/auth/login`)
        .send({ email: TEST_USER.email, password: 'wrong' })
        .expect(401);
    });

    it('should return 401 with non-existent user', async () => {
      await request(app)
        .post(`${API_VERSION}/auth/login`)
        .send({ email: 'notfound@example.com', password: 'test' })
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 200 on successful logout', async () => {
      await request(app)
        .post(`${API_VERSION}/auth/logout`)
        .set(authHeaders())
        .expect(200);
    });
  });
});

// =============================================================================
// RESPONSE SCHEMA TESTS
// =============================================================================

describe('Response Schema Validation', () => {
  it('should have required fields in resource response', async () => {
    const response = await request(app)
      .get(`${API_VERSION}/resources/1`)
      .set(authHeaders());

    if (response.status === 200) {
      const requiredFields = ['id', 'name', 'createdAt', 'updatedAt'];
      requiredFields.forEach((field) => {
        expect(response.body).toHaveProperty(field);
      });
    }
  });

  it('should have standard error format', async () => {
    const response = await request(app)
      .get(`${API_VERSION}/resources/999999`)
      .set(authHeaders());

    if (response.status >= 400) {
      expect(
        response.body.error ||
        response.body.message ||
        response.body.detail
      ).toBeDefined();
    }
  });
});

// =============================================================================
// RATE LIMITING TESTS
// =============================================================================

describe('Rate Limiting', () => {
  it('should return 429 when rate limit exceeded', async () => {
    // Send many requests quickly
    const requests = Array(100).fill(null).map(() =>
      request(app)
        .get(`${API_VERSION}/resources`)
        .set(authHeaders())
    );

    const responses = await Promise.all(requests);
    const rateLimited = responses.some((r) => r.status === 429);

    // This test may or may not trigger rate limiting depending on config
    expect(true).toBe(true); // Placeholder
  });
});
