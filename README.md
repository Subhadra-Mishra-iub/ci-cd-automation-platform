# CI/CD Automation Platform

A comprehensive full-stack application that demonstrates modern DevOps practices, automated testing, and continuous integration/deployment pipelines. This platform provides a complete solution for managing CI/CD workflows, monitoring pipeline health, and automating software delivery processes.

## 🎯 What This Project Does

This CI/CD Automation Platform is a **complete DevOps solution** that includes:

### Core Functionality
- **Pipeline Management**: Create, monitor, and manage CI/CD pipelines
- **Build Automation**: Automated building, testing, and deployment workflows
- **Real-time Monitoring**: Live dashboard showing pipeline status and metrics
- **User Authentication**: Secure access control for team members
- **API Management**: RESTful API for integrating with external tools
- **Health Monitoring**: System health checks and performance metrics

### CI/CD Pipeline Logic
The platform implements a **modern CI/CD workflow** that demonstrates:

1. **Continuous Integration**: 
   - Automated code testing on every commit
   - Quality gates and code coverage requirements
   - Automated security scanning

2. **Continuous Deployment**:
   - Automated deployment to staging/production
   - Blue-green deployment strategies
   - Rollback capabilities

3. **DevOps Best Practices**:
   - Infrastructure as Code (Docker, Docker Compose)
   - Automated testing (Unit, Integration, E2E)
   - Monitoring and observability
   - Security scanning and compliance

## 🚀 Features

- **Frontend**: React.js with TypeScript and modern UI
- **Backend**: Node.js/Express API with TypeScript
- **DevOps**: Docker containerization and GitHub Actions CI/CD
- **Testing**: Unit, integration, and E2E tests
- **Documentation**: Comprehensive API docs and deployment guides
- **Monitoring**: Real-time metrics and health monitoring

## 📁 Project Structure

```
ci-cd-automation-platform/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Configuration files
│   ├── tests/              # Backend tests
│   └── package.json
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── tests/             # Frontend tests
│   └── package.json
├── docker/                 # Docker configurations
├── docs/                   # Documentation
├── .github/               # GitHub Actions workflows
├── scripts/               # Utility scripts
└── README.md
```

## 🛠️ Tech Stack

### Backend
- Node.js 16+
- Express.js
- TypeScript
- Jest (Testing)
- Supertest (Integration Testing)

### Frontend
- React 18
- TypeScript
- Vite (Build Tool)
- Jest + React Testing Library
- Cypress (E2E Testing)
- Tailwind CSS (Styling)

### DevOps
- Docker & Docker Compose
- GitHub Actions
- Nginx (Reverse Proxy)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Git
- Docker & Docker Compose (optional)

### Step-by-Step Testing Guide

#### 1. **Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/Subhadra-Mishra-iub/ci-cd-automation-platform.git
cd ci-cd-automation-platform

# Verify the project structure
ls -la
```

#### 2. **Test Backend API**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server
node test-server.js
```

**Expected Output:**
```
🚀 Server running on port 3001
📊 Health check: http://localhost:3001/health
📚 API docs: http://localhost:3001/api
```

#### 3. **Test API Endpoints**

Open a new terminal and run these commands to test the API:

```bash
# Test health check endpoint
curl http://localhost:3001/health

# Expected response:
# {"status":"healthy","timestamp":"...","uptime":...,"environment":"development","version":"1.0.0"}

# Test API documentation endpoint
curl http://localhost:3001/api

# Expected response:
# {"message":"CI/CD Automation Platform API","version":"1.0.0","endpoints":{...}}

# Test pipelines endpoint
curl http://localhost:3001/api/pipelines

# Expected response:
# {"success":true,"data":{"pipelines":[...]}}

# Test authentication endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Expected response:
# {"success":true,"data":{"user":{...},"token":"mock-jwt-token"}}
```

#### 4. **Test Frontend (Optional)**

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 5. **Run Tests**

```bash
# Backend tests (in backend directory)
cd ../backend
npm test

# Frontend tests (in frontend directory)
cd ../frontend
npm test

# E2E tests (in frontend directory)
npm run test:e2e
```

#### 6. **Test with Docker (Optional)**

```bash
# From project root
docker-compose up -d

# Check if services are running
docker-compose ps

# Test the application
curl http://localhost:3000/health
```

## 🧪 What We Test

### Backend Testing
1. **Health Check**: Verify server is running and healthy
2. **API Endpoints**: Test all REST endpoints return correct responses
3. **Authentication**: Verify login/logout functionality
4. **Data Validation**: Ensure proper request/response handling
5. **Error Handling**: Test error scenarios and edge cases

### Frontend Testing
1. **Component Rendering**: Verify React components render correctly
2. **User Interactions**: Test buttons, forms, and navigation
3. **API Integration**: Ensure frontend communicates with backend
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Verify keyboard navigation and screen readers

### E2E Testing
1. **User Workflows**: Complete user journeys from start to finish
2. **Cross-browser Testing**: Test in different browsers
3. **Performance**: Verify page load times and responsiveness
4. **Integration**: Test frontend-backend integration

## 🔧 CI/CD Pipeline Explanation

### How the Pipeline Works

1. **Code Commit Trigger**:
   - Every push to main branch triggers the pipeline
   - Pull requests trigger separate validation pipeline

2. **Automated Testing**:
   - **Unit Tests**: Test individual functions and components
   - **Integration Tests**: Test API endpoints and database interactions
   - **E2E Tests**: Test complete user workflows
   - **Security Scan**: Automated vulnerability scanning with Trivy

3. **Quality Gates**:
   - Code coverage must be above 80%
   - All tests must pass
   - No security vulnerabilities
   - Code linting and formatting checks

4. **Build Process**:
   - Create optimized Docker images
   - Run security scans on images
   - Tag images with version numbers

5. **Deployment**:
   - Deploy to staging environment first
   - Run smoke tests on staging
   - Deploy to production if staging tests pass
   - Monitor deployment health

### Pipeline Benefits

- **Faster Delivery**: Automated processes reduce manual errors
- **Consistent Quality**: Every deployment follows the same process
- **Early Bug Detection**: Issues caught before production
- **Rollback Capability**: Quick rollback to previous versions
- **Audit Trail**: Complete history of all deployments

## 📚 Documentation

- [API Documentation](./docs/api.md) - Complete API reference
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions
- [Testing Guide](./docs/testing.md) - Comprehensive testing documentation
- [Architecture Overview](./docs/architecture.md) - System architecture details

## 🔍 Monitoring & Observability

- **Application Metrics**: Real-time performance monitoring
- **Health Checks**: Automated system health verification
- **Logging**: Structured logging for debugging
- **Alerts**: Automated notifications for issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
