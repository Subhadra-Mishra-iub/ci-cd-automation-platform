import request from 'supertest';
import app from '../../index';
import { User } from '../../models/User';
import { redisClient } from '../../config/redis';

describe('Auth Controller', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'developer' as const,
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await redisClient.flushAll();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
      expect(response.body.data.user.role).toBe(testUser.role);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      await User.create(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    let token: string;

    beforeEach(async () => {
      await User.create(testUser);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      token = loginResponse.body.data.token;
    });

    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logged out successfully');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      await User.create(testUser);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      token = loginResponse.body.data.token;
    });

    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
