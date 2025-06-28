#!/bin/bash

# Tasks UI - GCP Deployment Setup Script
# This script helps set up the necessary GCP resources and GitHub secrets for deployment

echo "🚀 Tasks UI - GCP Deployment Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud SDK (gcloud) is not installed"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

print_status "Google Cloud SDK is installed"

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$CURRENT_PROJECT" ]; then
    print_error "No default project set. Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

print_info "Current GCP Project: $CURRENT_PROJECT"

echo ""
echo "📋 Pre-deployment Checklist:"
echo "=============================="

# 1. Enable required APIs
print_info "1. Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
print_status "APIs enabled"

# 2. Create service account for GitHub Actions
print_info "2. Creating service account for GitHub Actions..."
SERVICE_ACCOUNT_NAME="github-actions-deploy"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$CURRENT_PROJECT.iam.gserviceaccount.com"

# Check if service account exists
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" &> /dev/null; then
    print_warning "Service account already exists: $SERVICE_ACCOUNT_EMAIL"
else
    gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
        --description="Service account for GitHub Actions deployment" \
        --display-name="GitHub Actions Deploy"
    print_status "Service account created: $SERVICE_ACCOUNT_EMAIL"
fi

# 3. Grant necessary roles
print_info "3. Granting necessary roles to service account..."
gcloud projects add-iam-policy-binding "$CURRENT_PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$CURRENT_PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "$CURRENT_PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/iam.serviceAccountUser"

print_status "Roles granted"

# 4. Create and download service account key
print_info "4. Creating service account key..."
KEY_FILE="gcp-sa-key.json"
gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SERVICE_ACCOUNT_EMAIL"

print_status "Service account key created: $KEY_FILE"

# 5. Create Artifact Registry repository
print_info "5. Creating Artifact Registry repository..."
REPOSITORY_NAME="tasks-ui"
REGION="us-central1"

if gcloud artifacts repositories describe "$REPOSITORY_NAME" --location="$REGION" &> /dev/null; then
    print_warning "Artifact Registry repository already exists: $REPOSITORY_NAME"
else
    gcloud artifacts repositories create "$REPOSITORY_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="Repository for Tasks UI container images"
    print_status "Artifact Registry repository created: $REPOSITORY_NAME"
fi

echo ""
echo "🔐 GitHub Secrets Configuration:"
echo "================================"
print_info "Add the following secrets to your GitHub repository:"
print_info "Go to: GitHub Repository → Settings → Secrets and variables → Actions"
echo ""

echo -e "${YELLOW}Secret Name${NC}: GCP_PROJECT_ID"
echo -e "${YELLOW}Secret Value${NC}: $CURRENT_PROJECT"
echo ""

echo -e "${YELLOW}Secret Name${NC}: GCP_SA_KEY"
echo -e "${YELLOW}Secret Value${NC}: (copy the entire content of $KEY_FILE)"
echo ""

echo -e "${YELLOW}Secret Name${NC}: API_BASE_URL"
echo -e "${YELLOW}Secret Value${NC}: https://your-api-url.run.app/api"
echo -e "${BLUE}Note${NC}: Replace with your actual API URL from your Spring Boot deployment"
echo ""

echo "📝 Next Steps:"
echo "=============="
print_info "1. Add the above secrets to your GitHub repository"
print_info "2. Update the API_BASE_URL secret with your actual API endpoint"
print_info "3. Push your code to the main branch to trigger deployment"
print_info "4. Monitor the deployment in GitHub Actions"
echo ""

print_warning "Important: Store the $KEY_FILE securely and delete it after adding to GitHub secrets"
print_warning "The deployment will create resources that may incur charges. Monitor your GCP billing."

echo ""
print_status "Setup complete! Your GCP environment is ready for deployment."
