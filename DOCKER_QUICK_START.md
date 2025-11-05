# Docker Quick Start

Simple guide to run everything in Docker.

## 🚀 One Port Setup

Everything runs through **port 3019**:
- Mini app (frontend)
- API (proxied through nginx)
- Backend bot (internal)

## 📋 Setup

**1. Configure environment:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

**2. Build and run:**
```bash
docker-compose up -d
```

**3. Access:**
- Mini App: `http://localhost:3019`
- API: `http://localhost:3019/api/health`

That's it! ✅

## 🏗️ How It Works

```
Port 3019 (Exposed)
    ↓
┌─────────────────────────┐
│  Nginx                  │
│  • Serves mini app      │
│  • Proxies /api/ to →   │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│  Backend (Port 3000)    │
│  • REST API             │
│  • Telegram Bot         │
│  • Internal only        │
└─────────────────────────┘
```

## 🔧 Commands

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 📝 What Changed

**From development:**
- Dev: Backend on 3000, Mini app on 3019
- Docker: Everything through 3019 (nginx proxies API)

**Benefits:**
- ✅ Only one port to expose
- ✅ No CORS issues
- ✅ Simpler deployment
- ✅ Better for production

## 🌐 Production

When deployed, users access:
```
https://your-domain.com        → Mini app
https://your-domain.com/api    → Backend API (proxied)
```

All through one domain, one port!

## 📊 Logs

```bash
# All logs
docker-compose logs -f

# Just backend
docker-compose logs -f | grep "node"

# Just nginx
docker-compose logs -f | grep "nginx"
```

## 🛠️ Troubleshooting

**Container won't start:**
```bash
docker-compose logs app
```

**Can't access mini app:**
```bash
# Check if running
docker ps

# Check nginx
docker exec fantasy-cricket-app ps aux | grep nginx
```

**API not working:**
```bash
# Test API directly
docker exec fantasy-cricket-app wget -O- http://localhost:3000/api/health

# Test through nginx
curl http://localhost:3019/api/health
```

## ✅ Checklist

- [ ] `.env` configured
- [ ] Docker installed
- [ ] Port 3019 available
- [ ] MongoDB URI set
- [ ] Bot token set

Ready to deploy! 🎉
