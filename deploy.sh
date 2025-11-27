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

if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "Error: GOOGLE_CLIENT_ID is not set. Please add it to backend/.env"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "Error: GOOGLE_CLIENT_SECRET is not set. Please add it to backend/.env"
    exit 1
fi

# Set FRONTEND_URL for production (will be updated after first deployment)
export FRONTEND_URL="${FRONTEND_URL:-https://ai-productivity-benchmark-frontend-csyt6j5toa-ue.a.run.app}"

# Set GOOGLE_CALLBACK_URL for OAuth
export GOOGLE_CALLBACK_URL="${GOOGLE_CALLBACK_URL:-https://ai-productivity-benchmark-backend-csyt6j5toa-ue.a.run.app/api/auth/google/callback}"

# Submit build to Cloud Build
echo "Submitting build to Cloud Build..."
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_DATABASE_URL="$DATABASE_URL",_GEMINI_API_KEY="$GEMINI_API_KEY",_JWT_SECRET="$JWT_SECRET",_GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID",_GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET",_GOOGLE_CALLBACK_URL="$GOOGLE_CALLBACK_URL",_FRONTEND_URL="$FRONTEND_URL" .

echo "Deployment complete!"
echo "Frontend: $(gcloud run services describe ai-productivity-benchmark-frontend --platform managed --region us-east1 --format 'value(status.url)')"
echo "Backend: $(gcloud run services describe ai-productivity-benchmark-backend --platform managed --region us-east1 --format 'value(status.url)')"
echo ""
echo "Note: Python Agent Service runs locally with stdio transport."
echo "To run it: cd python-agent-service && ./run_local.sh"
