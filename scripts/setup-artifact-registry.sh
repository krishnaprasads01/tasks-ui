#!/bin/bash

# Setup Google Artifact Registry for tasks-ui project
# Run this script before your first deployment

set -e

echo "🚀 Setting up Google Artifact Registry for tasks-ui..."

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="us-central1"
REPOSITORY_NAME="tasks-ui"

echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Repository: $REPOSITORY_NAME"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1 > /dev/null; then
    echo "❌ Error: Not authenticated with gcloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Set the project
echo "📋 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create Artifact Registry repository
echo "📦 Creating Artifact Registry repository..."
if gcloud artifacts repositories describe $REPOSITORY_NAME --location=$REGION --format="value(name)" 2>/dev/null; then
    echo "✅ Repository '$REPOSITORY_NAME' already exists"
else
    gcloud artifacts repositories create $REPOSITORY_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for tasks-ui application"
    echo "✅ Repository '$REPOSITORY_NAME' created successfully"
fi

# Configure Docker authentication
echo "🔐 Configuring Docker authentication..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Repository Details:"
echo "   Name: $REPOSITORY_NAME"
echo "   Location: $REGION"
echo "   URL: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}"
echo ""
echo "🚀 You can now run your GitHub Actions deployment!"
echo ""
echo "💡 Next steps:"
echo "   1. Make sure your GitHub secrets are configured:"
echo "      - GCP_PROJECT_ID: $PROJECT_ID"
echo "      - GCP_SA_KEY: Your service account JSON key"
echo "      - API_BASE_URL: Your Spring Boot API URL"
echo "   2. Push to main branch to trigger deployment"
