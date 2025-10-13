#!/bin/bash

# Registry name
SERVICE="portal-frontend"
ENVIRONMENT=$1
REGISTRY_PROJECT="devlaundromat"
REGISTRY_USER="devlaundromat"

# Set environment and env file based on parameter
if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    echo "Valid environments: production, staging"
    echo "Example: $0 production"
    echo "Example: $0 staging"
    exit 1
elif [ "$ENVIRONMENT" == "production" ]; then
    ENVIRONMENT="production"
    ENV_FILE=".env.production"
    echo "Building for production environment with .env.production"
elif [ "$ENVIRONMENT" == "staging" ]; then
    ENVIRONMENT="staging"
    ENV_FILE=".env.staging"
    echo "Building for staging environment with .env.staging"
else
    echo "Invalid environment: ${ENVIRONMENT}. Valid options: production, staging"
    exit 1
fi

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Warning: Environment file $ENV_FILE not found. Using default .env if available."
    if [ ! -f ".env" ]; then
        echo "Error: No .env file found. Please create the appropriate environment file."
        exit 1
    fi
    ENV_FILE=".env"
fi

if [ "$SERVICE" == "portal-frontend" ]; then
    SERVICE_NAME="lms-portal-frontend"
else
    echo "Invalid service: ${SERVICE}"
    exit 1
fi

# Select Dockerfile based on service
if [ "$SERVICE" == "portal-frontend" ]; then
    DOCKERFILE="Dockerfile"
fi

# Get the current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Try to get git commit hash if available
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "nogit")

# Generate unique tag
TAG="${SERVICE_NAME}_${ENVIRONMENT}:${TIMESTAMP}_${GIT_HASH}"

# Build the image
echo "Building Docker image with tag: ${TAG} using Dockerfile: ${DOCKERFILE}"
echo "Using environment file: ${ENV_FILE} for environment: ${ENVIRONMENT}"
docker build -t ${TAG} --platform linux/amd64 -f ${DOCKERFILE} --build-arg ENV_FILE=${ENV_FILE} --build-arg ENVIRONMENT=${ENVIRONMENT} .
echo "Image built successfully!"

# Tag as latest
docker tag ${TAG} ${REGISTRY_PROJECT}/${TAG}

echo "Image tag: ${TAG}"
echo "Registry image tag: ${REGISTRY_PROJECT}/${TAG}"

docker push ${REGISTRY_PROJECT}/${TAG}
