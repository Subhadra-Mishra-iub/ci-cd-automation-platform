# CI/CD Automation Platform

A comprehensive full-stack application demonstrating modern DevOps practices, automated testing, and continuous integration/deployment pipelines.

## 🚀 Features

- **Frontend**: React.js with TypeScript and modern UI
- **Backend**: Node.js/Express API with TypeScript
- **DevOps**: Docker containerization and GitHub Actions CI/CD
- **Testing**: Unit, integration, and E2E tests
- **Documentation**: Comprehensive API docs and deployment guides

## 🎯 Target Roles

This project demonstrates skills for:
- Site Reliability Engineer
- Automation Engineer
- QA Engineer
- QA Automation Engineer
- Data Analyst
- Data Engineer
- Cloud Engineer
- ML Engineer
- SD Engineer in Test
- Test Engineer
- ML Ops

## 📁 Project Structure

```
ci-cd-automation-platform/
├── backend/                 # Node.js/Express API
├── frontend/               # React.js application
├── docker/                 # Docker configurations
├── docs/                   # Documentation
├── tests/                  # E2E tests
├── .github/               # GitHub Actions workflows
├── scripts/               # Utility scripts
└── README.md
```

## 🛠️ Tech Stack

### Backend
- Node.js 18+
- Express.js
- TypeScript
- Jest (Testing)
- Supertest (Integration Testing)
- MongoDB (Database)
- Redis (Caching)

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
- PM2 (Process Manager)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Subhadra-Mishra-iub/ci-cd-automation-platform.git
   cd ci-cd-automation-platform
   ```

2. **Start with Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

3. **Or run locally**
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend (new terminal)
   cd frontend
   npm install
   npm run dev
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test              # Unit tests
npm run test:e2e      # E2E tests with Cypress
```

### E2E Tests
```bash
npm run test:e2e      # Run all E2E tests
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Testing Guide](./docs/testing.md)
- [Architecture Overview](./docs/architecture.md)

## 🔧 CI/CD Pipeline

The project includes GitHub Actions workflows for:
- Automated testing
- Code quality checks
- Docker image building
- Deployment to staging/production

## 📊 Monitoring & Observability

- Application metrics with Prometheus
- Logging with Winston
- Health checks and readiness probes
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
