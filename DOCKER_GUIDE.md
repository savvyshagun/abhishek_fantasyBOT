# Docker Deployment Guide

Complete guide for running both backend and mini app in Docker.

## 🐳 Architecture

The Docker setup runs **both services** in a single container:

```
┌─────────────────────────────┐
│     Docker Container        │
│                             │
│  ┌──────────────────────┐  │
│  │  Backend Bot         │  │
│  │  (Node.js)           │  │
│  │  Port: 3000          │  │
│  └──────────────────────┘  │
│                             │
│  ┌──────────────────────┐  │
│  │  Mini App            │  │
│  │  (Nginx)             │  │
│  │  Port: 3019          │  │
│  └──────────────────────┘  │
└─────────────────────────────┘
```

## 📋 Prerequisites

- Docker installed
- Docker Compose installed
- `.env` file configured

## 🚀 Quick Start

### 1. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

**Required variables:**
```env
BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fantasy_cricket
MINI_APP_URL=https://your-domain.com  # or http://localhost:3019 for testing
PORT=3000
```

### 2. Build and Run

```bash
# Build and start both services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 File Structure

```
.
├── Dockerfile              # Multi-stage build configuration
├── docker-compose.yml      # Docker Compose setup
├── docker/
│   ├── nginx.conf         # Nginx config for mini app
│   └── start.sh           # Startup script for both services
├── src/                   # Backend source
└── mini-app/              # Mini app source
```

## 🏗️ Build Process

The Dockerfile uses **multi-stage builds** for optimization:

### Stage 1: Backend Builder
```dockerfile
FROM node:18-alpine AS backend-builder
# Installs backend dependencies
# Copies backend source code
```

### Stage 2: Mini App Builder
```dockerfile
FROM node:18-alpine AS miniapp-builder
# Installs mini app dependencies
# Builds mini app for production (npm run build)
```

### Stage 3: Final Image
```dockerfile
FROM node:18-alpine
# Installs nginx
# Copies backend from stage 1
# Copies built mini app from stage 2
# Configures both services
```

## 🔧 How It Works

### Startup Sequence

1. **Nginx starts** (background process)
   - Serves mini app on port 3019
   - Static files from `/app/mini-app/dist`
   - SPA routing configured

2. **Backend starts** (main process)
   - Node.js bot on port 3000
   - API server
   - Telegram bot polling
   - Cron jobs

### Port Mappings

| Service | Container Port | Host Port | Purpose |
|---------|---------------|-----------|---------|
| Backend API | 3000 | 3000 | REST API, Bot |
| Mini App | 3019 | 3019 | Static web app |

## 🔍 Monitoring

### Check Container Status

```bash
# View running containers
docker ps

# Check logs
docker-compose logs -f app

# Check backend logs only
docker-compose logs -f app | grep backend

# Check nginx logs
docker exec fantasy-cricket-app cat /var/log/nginx/error.log
```

### Health Checks

The container has built-in health checks:

```bash
# Check health status
docker inspect fantasy-cricket-app | grep -A 10 Health

# Manual health check
curl http://localhost:3000/api/health
curl http://localhost:3019/health
```

## 🛠️ Development vs Production

### Development (Local)
```bash
npm run dev:all
```
- Hot reload for both services
- Source maps enabled
- Debug logging

### Production (Docker)
```bash
docker-compose up -d
```
- Minified builds
- Optimized images
- Production mode
- Auto-restart on failure

## 📊 Container Details

### Image Size
- Base: ~150 MB (Node + Alpine)
- Backend: ~50 MB
- Mini App: ~2 MB (built)
- Nginx: ~10 MB
- **Total**: ~212 MB

### Resource Usage
- CPU: Low (event-driven)
- RAM: ~150-200 MB
- Disk: ~212 MB

### Security Features
- Non-root user (nodejs:1001)
- Read-only filesystem where possible
- Minimal Alpine base
- Security headers in nginx
- No sensitive data in image

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### View Logs

```bash
# All logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific timeframe
docker-compose logs --since 30m
```

### Restart Services

```bash
# Restart both services
docker-compose restart

# Restart specific service (if needed)
docker-compose restart app
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose config

# Verify .env file
cat .env
```

### Port Already in Use

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3019

# Kill processes or change ports in docker-compose.yml
```

### Mini App Not Loading

```bash
# Check nginx status
docker exec fantasy-cricket-app ps aux | grep nginx

# Check nginx logs
docker exec fantasy-cricket-app cat /var/log/nginx/error.log

# Check files exist
docker exec fantasy-cricket-app ls -la /app/mini-app/dist
```

### Backend Not Responding

```bash
# Check Node process
docker exec fantasy-cricket-app ps aux | grep node

# Check API health
curl http://localhost:3000/api/health

# Check environment
docker exec fantasy-cricket-app printenv
```

### MongoDB Connection Issues

```bash
# Test MongoDB connection
docker exec fantasy-cricket-app node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

## 🌐 Production Deployment

### Option 1: Docker Hub

```bash
# Build and tag
docker build -t yourusername/fantasy-cricket:latest .

# Push to Docker Hub
docker push yourusername/fantasy-cricket:latest

# Pull and run on server
docker pull yourusername/fantasy-cricket:latest
docker run -d -p 3000:3000 -p 3019:3019 --env-file .env yourusername/fantasy-cricket:latest
```

### Option 2: Docker Registry (Private)

```bash
# Tag for private registry
docker tag fantasy-cricket your-registry.com/fantasy-cricket:latest

# Push
docker push your-registry.com/fantasy-cricket:latest

# Deploy
docker pull your-registry.com/fantasy-cricket:latest
docker-compose up -d
```

### Option 3: Cloud Platforms

**AWS ECS/Fargate:**
- Use docker-compose.yml as reference
- Create ECS task definition
- Deploy to ECS cluster

**Google Cloud Run:**
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/fantasy-cricket
gcloud run deploy --image gcr.io/PROJECT-ID/fantasy-cricket
```

**DigitalOcean App Platform:**
- Connect GitHub repo
- Auto-deploy from Dockerfile
- Set environment variables in UI

## 📝 Environment Variables

### Required
```env
BOT_TOKEN=              # Telegram bot token
MONGODB_URI=            # MongoDB connection string
MINI_APP_URL=           # Mini app URL (for bot buttons)
PORT=3000              # Backend port
```

### Optional
```env
ADMIN_IDS=             # Comma-separated admin IDs
SPORTS_API_KEY=        # Cricket API key
NODE_ENV=production    # Environment
```

## 🔐 Security Best Practices

1. **Use secrets management:**
   ```bash
   docker secret create bot_token ./bot_token.txt
   ```

2. **Enable Docker Content Trust:**
   ```bash
   export DOCKER_CONTENT_TRUST=1
   ```

3. **Scan for vulnerabilities:**
   ```bash
   docker scan fantasy-cricket-app
   ```

4. **Limit resources:**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

## 📈 Scaling

### Horizontal Scaling

For multiple instances:

```yaml
services:
  app:
    deploy:
      replicas: 3
    ports:
      - "3000-3002:3000"
      - "3019-3021:3019"
```

### Load Balancer

Use nginx or HAProxy in front:

```nginx
upstream backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}
```

## 🎯 Performance Tips

1. **Use volume mounts for logs:**
   ```yaml
   volumes:
     - ./logs:/app/logs
   ```

2. **Enable log rotation:**
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

3. **Optimize nginx:**
   - Enable gzip
   - Set proper cache headers
   - Use CDN for static assets

## 📚 Additional Commands

```bash
# Execute command in container
docker exec -it fantasy-cricket-app sh

# Copy files from container
docker cp fantasy-cricket-app:/app/logs ./logs

# View container stats
docker stats fantasy-cricket-app

# Clean up unused images
docker system prune -a

# Export container
docker export fantasy-cricket-app > app.tar

# Import container
docker import app.tar
```

## ✅ Checklist

Before deploying:

- [ ] `.env` file configured
- [ ] MongoDB connection tested
- [ ] Bot token verified
- [ ] Mini app URL set
- [ ] Ports available (3000, 3019)
- [ ] Docker daemon running
- [ ] Sufficient disk space
- [ ] Network connectivity
- [ ] Health checks passing

## 🆘 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify health: `docker ps`
3. Test endpoints manually
4. Review environment variables
5. Check Docker daemon

---

**Ready to deploy!** 🚀

Run: `docker-compose up -d`
