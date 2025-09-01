const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development',
    version: '1.0.0',
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    message: 'CI/CD Automation Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      pipelines: '/api/pipelines',
      metrics: '/api/metrics/system',
    },
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '123',
        name: req.body.name || 'Test User',
        email: req.body.email || 'test@example.com',
        role: 'developer',
      },
      token: 'mock-jwt-token',
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '123',
        name: 'Test User',
        email: req.body.email || 'test@example.com',
        role: 'developer',
      },
      token: 'mock-jwt-token',
    },
  });
});

// Pipelines routes
app.get('/api/pipelines', (req, res) => {
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
          lastRun: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Backend API Tests',
          description: 'Run backend API tests',
          status: 'active',
          totalRuns: 200,
          successfulRuns: 195,
          failedRuns: 5,
          successRate: 98,
          lastRun: new Date().toISOString(),
        },
      ],
    },
  });
});

// Metrics routes
app.get('/api/metrics/system', (req, res) => {
  res.json({
    success: true,
    data: {
      cpu: {
        usage: 45.2,
        cores: 8,
      },
      memory: {
        used: 4096,
        total: 8192,
        usage: 50.0,
      },
      disk: {
        used: 100,
        total: 500,
        usage: 20.0,
      },
      uptime: process.uptime(),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});
