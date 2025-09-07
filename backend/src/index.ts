import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3001',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: '1.0.0',
  });
});

// API routes
app.get('/api', (_req, res) => {
  res.json({
    message: 'CI/CD Automation Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      pipelines: '/api/pipelines',
      deployments: '/api/deployments',
      metrics: '/api/metrics',
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
app.get('/api/metrics/system', (_req, res) => {
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`📚 API documentation at http://localhost:${PORT}/api`);
});

export default app;
