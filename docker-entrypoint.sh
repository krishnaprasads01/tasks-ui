#!/bin/sh

# Replace environment variables in built files if they exist
if [ -f /usr/share/nginx/html/index.html ]; then
    # Replace API URL placeholder with actual environment variable
    if [ ! -z "$VITE_API_BASE_URL" ]; then
        find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://localhost:8080/api|$VITE_API_BASE_URL|g" {} \;
    fi
    
    if [ ! -z "$VITE_APP_ENV" ]; then
        find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_APP_ENV=development|VITE_APP_ENV=$VITE_APP_ENV|g" {} \;
    fi
fi

# Execute the main command
exec "$@"
