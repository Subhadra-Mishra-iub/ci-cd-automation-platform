# API Documentation

## Overview

The CI/CD Automation Platform API is a RESTful service built with Node.js, Express, and TypeScript. It provides endpoints for managing CI/CD pipelines, deployments, user authentication, and system metrics.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "developer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "developer",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "developer"
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "developer",
      "preferences": {
        "theme": "light",
        "notifications": true,
        "timezone": "UTC"
      }
    }
  }
}
```

### Pipelines

#### GET /api/pipelines
Get all pipelines (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `status` (string): Filter by status (active, inactive, archived)
- `search` (string): Search by pipeline name

**Response:**
```json
{
  "success": true,
  "data": {
    "pipelines": [
      {
        "_id": "pipeline_id",
        "name": "Frontend Build",
        "description": "Build and test frontend application",
        "repository": {
          "url": "https://github.com/user/repo",
          "branch": "main",
          "type": "github"
        },
        "status": "active",
        "totalRuns": 150,
        "successfulRuns": 145,
        "failedRuns": 5,
        "successRate": 97,
        "lastRun": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### POST /api/pipelines
Create a new pipeline (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Backend API Tests",
  "description": "Run backend API tests",
  "repository": {
    "url": "https://github.com/user/backend",
    "branch": "develop",
    "type": "github"
  },
  "stages": [
    {
      "name": "Install Dependencies",
      "type": "build",
      "commands": ["npm install"],
      "timeout": 300,
      "order": 1
    },
    {
      "name": "Run Tests",
      "type": "test",
      "commands": ["npm test"],
      "timeout": 600,
      "order": 2
    }
  ],
  "triggers": {
    "push": true,
    "pullRequest": true,
    "manual": true
  },
  "environment": {
    "variables": [
      {
        "key": "NODE_ENV",
        "value": "test",
        "isSecret": false
      }
    ]
  }
}
```

#### GET /api/pipelines/:id
Get pipeline by ID (requires authentication).

#### PUT /api/pipelines/:id
Update pipeline (requires authentication).

#### DELETE /api/pipelines/:id
Delete pipeline (requires authentication).

#### POST /api/pipelines/:id/trigger
Trigger pipeline run (requires authentication).

### Deployments

#### GET /api/deployments
Get all deployments (requires authentication).

#### POST /api/deployments
Create new deployment (requires authentication).

#### GET /api/deployments/:id
Get deployment by ID (requires authentication).

#### PUT /api/deployments/:id
Update deployment (requires authentication).

#### DELETE /api/deployments/:id
Delete deployment (requires authentication).

#### POST /api/deployments/:id/rollback
Rollback deployment (requires authentication).

#### GET /api/deployments/:id/logs
Get deployment logs (requires authentication).

### Metrics

#### GET /api/metrics/system
Get system metrics (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "cpu": {
      "usage": 45.2,
      "cores": 8
    },
    "memory": {
      "used": 4096,
      "total": 8192,
      "usage": 50.0
    },
    "disk": {
      "used": 100,
      "total": 500,
      "usage": 20.0
    },
    "uptime": 86400
  }
}
```

#### GET /api/metrics/pipelines
Get pipeline metrics (requires authentication).

#### GET /api/metrics/deployments
Get deployment metrics (requires authentication).

#### GET /api/metrics/users
Get user activity metrics (requires admin authentication).

#### GET /api/metrics/performance
Get performance metrics (requires authentication).

#### GET /api/metrics/errors
Get error metrics (requires authentication).

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

## Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 86400,
  "responseTime": "5ms",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "environment": "production",
  "version": "1.0.0"
}
```

## Webhooks

The API supports webhooks for pipeline events. Configure webhook URLs in pipeline settings to receive notifications for:

- Pipeline started
- Pipeline completed
- Pipeline failed
- Deployment started
- Deployment completed
- Deployment failed

Webhook payload format:
```json
{
  "event": "pipeline.completed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "data": {
    "pipelineId": "pipeline_id",
    "pipelineName": "Frontend Build",
    "status": "success",
    "duration": 300,
    "commit": "abc123"
  }
}
```
