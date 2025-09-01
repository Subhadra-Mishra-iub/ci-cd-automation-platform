# Deployment Guide

## Overview

This guide covers deploying the CI/CD Automation Platform to various environments using Docker and modern DevOps practices.

## Prerequisites

- Docker and Docker Compose installed
- Git
- Node.js 18+ (for local development)
- MongoDB (for production)
- Redis (for production)

## Environment Setup

### 1. Development Environment

#### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Subhadra-Mishra-iub/ci-cd-automation-platform.git
   cd ci-cd-automation-platform
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

#### Manual Development Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 2. Staging Environment

#### Docker Deployment

1. **Build and deploy**
   ```bash
   # Build images
   docker-compose -f docker-compose.staging.yml build
   
   # Deploy
   docker-compose -f docker-compose.staging.yml up -d
   ```

2. **Environment variables for staging**
   ```bash
   # Create staging environment file
   cp .env.example .env.staging
   
   # Configure staging variables
   NODE_ENV=staging
   MONGODB_URI=mongodb://staging-mongo:27017/ci-cd-staging
   REDIS_URL=redis://staging-redis:6379
   JWT_SECRET=your-staging-jwt-secret
   ```

### 3. Production Environment

#### Docker Production Deployment

1. **Production Docker Compose**
   ```bash
   # Use production configuration
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Production environment variables**
   ```bash
   # Create production environment file
   cp .env.example .env.production
   
   # Configure production variables
   NODE_ENV=production
   MONGODB_URI=mongodb://prod-mongo:27017/ci-cd-production
   REDIS_URL=redis://prod-redis:6379
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-domain.com
   ```

#### Cloud Deployment

##### AWS Deployment

1. **EC2 Setup**
   ```bash
   # Install Docker on EC2
   sudo yum update -y
   sudo yum install -y docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy to EC2**
   ```bash
   # Clone repository
   git clone https://github.com/Subhadra-Mishra-iub/ci-cd-automation-platform.git
   cd ci-cd-automation-platform
   
   # Configure environment
   cp .env.example .env.production
   # Edit .env.production
   
   # Deploy
   docker-compose -f docker-compose.prod.yml up -d
   ```

##### Kubernetes Deployment

1. **Create Kubernetes manifests**
   ```yaml
   # k8s/namespace.yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: ci-cd-platform
   ```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/
   ```

## Monitoring and Observability

### 1. Health Checks

The application includes health check endpoints:

- **Backend Health**: `GET /health`
- **Frontend Health**: `GET /`

### 2. Logging

#### Application Logs
```bash
# View backend logs
docker logs ci-cd-backend

# View frontend logs
docker logs ci-cd-frontend

# View all logs
docker-compose logs -f
```

#### Log Aggregation
Configure log aggregation with ELK Stack or similar:

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch
```

### 3. Metrics and Monitoring

#### Prometheus Configuration
```yaml
# docker/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ci-cd-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'

  - job_name: 'ci-cd-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/metrics'
```

#### Grafana Dashboards
Import pre-configured dashboards for:
- Application metrics
- Pipeline performance
- System resources
- Error rates

## Security

### 1. SSL/TLS Configuration

#### Nginx SSL Configuration
```nginx
# docker/nginx-ssl.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://frontend:80;
    }

    location /api/ {
        proxy_pass http://backend:3000;
    }
}
```

### 2. Environment Variables Security

- Use secrets management for sensitive data
- Rotate JWT secrets regularly
- Use strong passwords for databases
- Enable database authentication

### 3. Network Security

- Configure firewalls
- Use VPC for cloud deployments
- Implement network policies in Kubernetes
- Enable DDoS protection

## Backup and Recovery

### 1. Database Backup

#### MongoDB Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec ci-cd-mongodb mongodump --out /data/backup_$DATE
docker cp ci-cd-mongodb:/data/backup_$DATE ./backups/
```

#### Redis Backup
```bash
# Redis persistence is enabled by default
# Manual backup
docker exec ci-cd-redis redis-cli BGSAVE
```

### 2. Application Backup

#### Docker Volumes
```bash
# Backup volumes
docker run --rm -v ci-cd-automation-platform_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_backup.tar.gz -C /data .
```

### 3. Disaster Recovery

1. **Recovery Plan**
   - Document recovery procedures
   - Test recovery regularly
   - Maintain backup verification

2. **High Availability**
   - Deploy across multiple availability zones
   - Use load balancers
   - Implement auto-scaling

## Scaling

### 1. Horizontal Scaling

#### Load Balancer Configuration
```nginx
# nginx load balancer
upstream backend {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

upstream frontend {
    server frontend1:80;
    server frontend2:80;
    server frontend3:80;
}
```

### 2. Auto Scaling

#### Docker Swarm
```bash
# Scale services
docker service scale ci-cd-backend=3
docker service scale ci-cd-frontend=3
```

#### Kubernetes HPA
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ci-cd-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ci-cd-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check MongoDB connection
   docker exec ci-cd-mongodb mongosh --eval "db.runCommand({ping: 1})"
   
   # Check Redis connection
   docker exec ci-cd-redis redis-cli ping
   ```

2. **Application Startup Issues**
   ```bash
   # Check application logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Check health endpoints
   curl http://localhost:3000/health
   curl http://localhost:3001
   ```

3. **Performance Issues**
   ```bash
   # Monitor resource usage
   docker stats
   
   # Check application metrics
   curl http://localhost:3000/metrics
   ```

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Set debug environment variable
export DEBUG=ci-cd-platform:*

# Restart services
docker-compose restart
```

## Maintenance

### 1. Regular Updates

- Update dependencies monthly
- Security patches immediately
- Monitor for vulnerabilities

### 2. Performance Optimization

- Monitor application performance
- Optimize database queries
- Implement caching strategies
- Use CDN for static assets

### 3. Capacity Planning

- Monitor resource usage
- Plan for growth
- Implement auto-scaling
- Regular capacity reviews
