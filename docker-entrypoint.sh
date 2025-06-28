#!/bin/sh
set -e

# Set default values if not provided
export PORT=${PORT:-8080}
export API_BASE_URL=${API_BASE_URL:-http://localhost:8080/api}

echo "Starting container with PORT=${PORT}"
echo "API_BASE_URL=${API_BASE_URL}"

# Generate nginx config with environment variables from template
envsubst '${PORT} ${API_BASE_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Test nginx configuration
nginx -t

# Replace environment variables in built files if they exist
if [ -f /usr/share/nginx/html/index.html ]; then
    # Only replace VITE_APP_ENV if provided
    if [ ! -z "$VITE_APP_ENV" ]; then
        find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_APP_ENV=development|VITE_APP_ENV=$VITE_APP_ENV|g" {} \;
    fi
    
    # Note: API_BASE_URL is set at build time via .env.production, not at runtime
    echo "Using build-time API configuration from .env.production"
fi

echo "Configuration complete, starting nginx..."

# Start nginx in foreground mode
exec nginx -g 'daemon off;'
