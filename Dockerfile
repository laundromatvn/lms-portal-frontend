# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Accept build arguments
ARG ENV_FILE=.env
ARG ENVIRONMENT=staging

# Copy package files
COPY package*.json ./

# Configure npm for better network handling
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000

# Install dependencies with retry logic
RUN npm ci || (sleep 5 && npm ci) || (sleep 10 && npm ci)

# Copy source code
COPY . .

# Copy the appropriate environment file
COPY ${ENV_FILE} .env

# Build the application with TypeScript checking disabled
ENV APP_ENV=${ENVIRONMENT}
ENV NODE_ENV=production
ENV VITE_SKIP_TYPECHECK=true
RUN npm run build:${ENVIRONMENT}

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
