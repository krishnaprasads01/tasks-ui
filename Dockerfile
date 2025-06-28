# Multi-stage build for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for building)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Set production environment and build the application
ENV NODE_ENV=production
RUN npm run build -- --mode production

# Production stage with nginx
FROM nginx:alpine

# Install gettext for envsubst command
RUN apk add --no-cache gettext

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy environment script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Health check for local development (disabled for Cloud Run)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start nginx with environment variable substitution
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
