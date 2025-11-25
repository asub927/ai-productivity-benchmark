#!/bin/bash

# Exit on error
set -e

PROJECT_ID=$(gcloud config get-value project)
echo "Deploying to Google Cloud Project: $PROJECT_ID"

# Check if backend/.env exists to source secrets
if [ -f backend/.env ]; then
    export $(cat backend/.env | grep -v '^#' | xargs)
fi

# Override DATABASE_URL for production
export DATABASE_URL="postgresql://ai_user:SecurePassword123!@localhost/ai_productivity_db?host=/cloudsql/nice-opus-478203-b3:us-east1:ai-productivity-db"

# Validate required environment variables
if [ -z "$GEMINI_API_KEY" ]; then
    echo "Error: GEMINI_API_KEY is not set. Please add it to backend/.env"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "Error: JWT_SECRET is not set. Please add it to backend/.env"
    exit 1
fi

# Submit build to Cloud Build
echo "Submitting build to Cloud Build..."
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_DATABASE_URL="$DATABASE_URL",_GEMINI_API_KEY="$GEMINI_API_KEY",_JWT_SECRET="$JWT_SECRET" .

echo "Deployment complete!"
echo "Frontend: $(gcloud run services describe ai-productivity-benchmark-frontend --platform managed --region us-east1 --format 'value(status.url)')"
echo "Backend: $(gcloud run services describe ai-productivity-benchmark-backend --platform managed --region us-east1 --format 'value(status.url)')"
echo "Python Agent: $(gcloud run services describe ai-productivity-benchmark-python --platform managed --region us-east1 --format 'value(status.url)')"
