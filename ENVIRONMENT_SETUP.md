# Environment Configuration Guide

## Overview
The application is configured to use different API endpoints based on the environment:

## 🔧 Environment Setup

### Development Environment
**File**: `.env.development`
**API Endpoint**: `http://localhost:8080/api`
**Usage**: Local development with local Spring Boot API

### Production Environment  
**File**: `.env.production`
**API Endpoint**: `https://springboot-gcp-api-service-78627022-1005440968570.us-central1.run.app/api`
**Usage**: Production deployment on Google Cloud Run

## 🚀 Running the Application

### Local Development
```bash
# Start development server (uses .env.development)
npm run dev

# Or with Docker Compose (includes local API)
docker-compose up
```

### Production Build & Test
```bash
# Build for production (uses .env.production)
npm run build

# Test production build locally
npm run preview

# Or build and run in Docker with production API
docker build -t tasks-ui .
docker run -p 3000:8080 \
  -e API_BASE_URL=https://springboot-gcp-api-service-78627022-1005440968570.us-central1.run.app/api \
  tasks-ui
```

### Docker Deployment Options

#### Development (with local API)
```bash
docker-compose up
```

#### Production (with cloud API)
```bash
docker run -p 3000:8080 \
  -e API_BASE_URL=https://springboot-gcp-api-service-78627022-1005440968570.us-central1.run.app/api \
  -e VITE_APP_ENV=production \
  tasks-ui
```

## 🚀 CI/CD Deployment

### GitHub Actions
The deployment workflow automatically:
1. Uses the `API_BASE_URL` secret for production builds
2. Creates production environment variables
3. Builds the application with production settings
4. Deploys to Google Cloud Run

### Required GitHub Secrets
- `GCP_PROJECT_ID`: Your Google Cloud Project ID
- `GCP_SA_KEY`: Service Account JSON key
- `API_BASE_URL`: Production API endpoint (the cloud endpoint)

## 📁 File Structure
```
├── .env.development     # Local development config
├── .env.production      # Production config  
├── docker-compose.yml   # Local dev with API
├── Dockerfile          # Production container
└── .github/workflows/
    └── deploy.yml      # CI/CD pipeline
```

## 🔄 Environment Variable Override

The application supports runtime environment variable override:
- `API_BASE_URL`: Override the API endpoint
- `PORT`: Override the nginx port (default: 8080)
- `VITE_APP_ENV`: Set environment (development/production)

This allows the same Docker image to work in different environments by just changing environment variables.
