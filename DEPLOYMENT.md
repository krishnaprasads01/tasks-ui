# Deployment Guide

This guide walks you through deploying the Tasks UI application to Google Cloud Platform (GCP) using GitHub Actions.

## Prerequisites

1. **Google Cloud Platform Account**: You'll need a GCP account with billing enabled
2. **GCP Project**: Create a new project or use an existing one
3. **GitHub Repository**: Your code should be in a GitHub repository
4. **Google Cloud SDK**: Install the `gcloud` CLI tool

## Step 1: GCP Setup

### Automated Setup (Recommended)

Run the provided setup script:

```bash
cd tasks-ui
./scripts/setup-gcp-deployment.sh
```

This script will:
- Enable required GCP APIs
- Create a service account for GitHub Actions
- Grant necessary permissions
- Create an Artifact Registry repository
- Generate a service account key

### Manual Setup (Alternative)

If you prefer to set up manually:

1. **Enable APIs**:
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

2. **Create Service Account**:
```bash
gcloud iam service-accounts create github-actions-deploy \
  --description="Service account for GitHub Actions deployment" \
  --display-name="GitHub Actions Deploy"
```

3. **Grant Roles**:
```bash
PROJECT_ID=$(gcloud config get-value project)
SERVICE_ACCOUNT="github-actions-deploy@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/iam.serviceAccountUser"
```

4. **Create Service Account Key**:
```bash
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account="$SERVICE_ACCOUNT"
```

## Step 2: GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

**Go to**: GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

### Required Secrets

| Secret Name | Description | Value |
|-------------|-------------|--------|
| `GCP_PROJECT_ID` | Your GCP project ID | `your-project-id` |
| `GCP_SA_KEY` | Service account JSON key | Copy entire content of `gcp-sa-key.json` |
| `API_BASE_URL` | Your deployed API endpoint | `https://your-api.run.app/api` |

### Getting Your API Base URL

1. Deploy your Spring Boot API to Cloud Run first
2. Get the URL from Cloud Run console or CLI:
```bash
gcloud run services describe your-api-service --region=us-central1 --format="value(status.url)"
```
3. Add `/api` to the end of the URL

## Step 3: Deploy

### Automatic Deployment

1. **Push to main branch**:
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

2. **Monitor deployment**:
   - Go to your GitHub repository
   - Click on "Actions" tab
   - Watch the deployment workflow

### Manual Deployment

If you need to deploy manually:

```bash
# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/tasks-ui .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/tasks-ui

# Deploy to Cloud Run
gcloud run deploy tasks-ui \
  --image gcr.io/$PROJECT_ID/tasks-ui \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars="VITE_API_BASE_URL=https://your-api.run.app/api"
```

## Step 4: Verification

### Check Deployment Status

1. **Cloud Run Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to Cloud Run
   - Check your service status

2. **Command Line**:
```bash
# Get service URL
gcloud run services describe tasks-ui --region=us-central1 --format="value(status.url)"

# Check service status
gcloud run services describe tasks-ui --region=us-central1
```

### Test the Application

1. Open the Cloud Run service URL in your browser
2. Verify the application loads correctly
3. Test creating, viewing, and managing tasks
4. Check that API calls work correctly

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check GitHub Actions logs
   - Verify all secrets are set correctly
   - Ensure Docker file is valid

2. **Deployment Failures**:
   - Check Cloud Run logs: `gcloud run logs tail tasks-ui --region=us-central1`
   - Verify service account permissions
   - Check API URL configuration

3. **API Connection Issues**:
   - Verify API_BASE_URL secret is correct
   - Ensure your API service is running
   - Check CORS configuration on API

### Debugging Commands

```bash
# View Cloud Run logs
gcloud run logs tail tasks-ui --region=us-central1

# Describe service configuration
gcloud run services describe tasks-ui --region=us-central1

# List all Cloud Run services
gcloud run services list

# Check service account permissions
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions-deploy*"
```

## Environment Management

### Development
- Runs on `http://localhost:5173`
- Uses local API at `http://localhost:8080/api`

### Production
- Deployed to Cloud Run
- Uses production API endpoint
- Environment variables managed through Cloud Run

### Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Your Cloud Run API URL |
| `VITE_APP_ENV` | `development` | `production` |
| `VITE_DEBUG` | `true` | `false` |

## Cost Optimization

### Cloud Run Pricing
- Pay only for requests and compute time
- Automatic scaling to zero when not in use
- Set maximum instances to control costs

### Configuration
```bash
# Update service with cost optimization
gcloud run services update tasks-ui \
  --region=us-central1 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --concurrency=100
```

## Security Best Practices

1. **Service Account**: Use principle of least privilege
2. **Secrets**: Never commit secrets to repository
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure API CORS properly
5. **Authentication**: Implement user authentication if needed

## Monitoring and Maintenance

### Health Checks
- Built-in health endpoint: `/health`
- Cloud Run automatic health monitoring
- Custom monitoring with Cloud Monitoring

### Logs
```bash
# Real-time logs
gcloud run logs tail tasks-ui --region=us-central1

# Filter logs by severity
gcloud run logs read tasks-ui --region=us-central1 --filter="severity>=ERROR"
```

### Updates
1. Push changes to main branch
2. GitHub Actions automatically rebuilds and deploys
3. Zero-downtime deployment with Cloud Run

## Support

For issues:
1. Check GitHub Actions logs
2. Review Cloud Run logs
3. Verify configuration
4. Check API connectivity
5. Review security settings

Remember to monitor your GCP billing and set up alerts for unexpected usage.
