# Multi-stage build for backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source
COPY src ./src

# Multi-stage build for mini app
FROM node:18-alpine AS miniapp-builder

WORKDIR /app

# Copy mini app package files
COPY mini-app/package*.json ./

# Install mini app dependencies
RUN npm ci

# Copy mini app source
COPY mini-app ./

# Build mini app for production
RUN npm run build

# Final production image
FROM node:18-alpine

# Install nginx for serving mini app
RUN apk add --no-cache nginx

WORKDIR /app

# Copy backend from builder
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package*.json ./
COPY src ./src

# Copy built mini app from builder
COPY --from=miniapp-builder /app/dist ./mini-app/dist

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app && \
    chown -R nodejs:nodejs /var/lib/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    mkdir -p /run/nginx && \
    chown -R nodejs:nodejs /run/nginx

# Create startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Switch to non-root user
USER nodejs

# Expose only mini app port
EXPOSE 3019

# Start both services
CMD ["/start.sh"]
