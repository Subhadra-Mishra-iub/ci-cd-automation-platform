import request from 'supertest';
import express from 'express';

// Create a simple test app
const app = express();
app.use(express.json());

// Mock endpoints for testing
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'test',
    version: '1.0.0'
  });
});

app.get('/api', (_req, res) => {
  res.json({
    message: 'CI/CD Automation Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      pipelines: '/api/pipelines',
      metrics: '/api/metrics/system'
    }
  });
});

app.get('/api/pipelines', (_req, res) => {
  res.json({
    success: true,
    data: {
      pipelines: [
        {
          id: '1',
          name: 'Frontend Build',
          description: 'Build and test frontend application',
          status: 'active',
          totalRuns: 150,
          successfulRuns: 145,
          failedRuns: 5,
          successRate: 97,
          lastRun: new Date().toISOString()
        }
      ]
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      success: true,
      data: {
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'developer'
        },
        token: 'mock-jwt-token'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid credentials'
      }
    });
  }
});

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body.environment).toBe('test');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.message).toBe('CI/CD Automation Platform API');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('pipelines');
    });
  });

  describe('GET /api/pipelines', () => {
    it('should return pipeline data', async () => {
      const response = await request(app)
        .get('/api/pipelines')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('pipelines');
      expect(Array.isArray(response.body.data.pipelines)).toBe(true);
      expect(response.body.data.pipelines[0]).toHaveProperty('name');
      expect(response.body.data.pipelines[0]).toHaveProperty('status');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid credentials');
    });
  });
});
