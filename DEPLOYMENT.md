# 🚀 VPS Deployment Guide

**VPS IP:** `212.227.99.187`  
**Domain:** `globalmediasports.es`  
**SSH:** `ssh root@212.227.99.187`

---

## 📦 After Frontend Changes

```bash
# 1. Push to GitHub from local machine
cd ~/sport_marketing_agency
git add -A && git commit -m "your message" && git push priyansh

# 2. SSH into VPS and pull + rebuild
ssh root@212.227.99.187
cd /var/www/sport_marketing_agency && git pull
cd frontend && npm install && npm run build
```

---

## ⚙️ After Backend Changes

```bash
# 1. Push to GitHub from local machine
cd ~/sport_marketing_agency
git add -A && git commit -m "your message" && git push priyansh

# 2. SSH into VPS and pull + rebuild + restart
ssh root@212.227.99.187
cd /var/www/sport_marketing_agency && git pull
cd backend && npm install && npm run build && pm2 restart backend
```

---

## 🔄 After Both Frontend + Backend Changes

```bash
# 1. Push to GitHub from local machine
cd ~/sport_marketing_agency
git add -A && git commit -m "your message" && git push priyansh

# 2. SSH into VPS
ssh root@212.227.99.187
cd /var/www/sport_marketing_agency && git pull

# 3. Rebuild backend
cd backend && npm install && npm run build && pm2 restart backend

# 4. Rebuild frontend
cd ../frontend && npm install && npm run build
```

---

## 🗄️ After Prisma Schema Changes

```bash
ssh root@212.227.99.187
cd /var/www/sport_marketing_agency/backend
npx prisma generate
npx prisma db push    # or: npx prisma migrate deploy
npm run build && pm2 restart backend
```

---

## 🔍 Useful Commands

| Command | What it does |
|---------|-------------|
| `pm2 logs backend --lines 20` | View backend logs |
| `pm2 status` | Check if backend is running |
| `pm2 restart backend` | Restart backend |
| `pm2 stop backend` | Stop backend |
| `nginx -t && systemctl restart nginx` | Test & restart Nginx |
| `certbot renew --dry-run` | Test SSL renewal |
| `cat /var/www/sport_marketing_agency/backend/.env` | View backend env |
| `cat /var/www/sport_marketing_agency/frontend/.env` | View frontend env |

---

## 📁 File Locations on VPS

| What | Path |
|------|------|
| Project root | `/var/www/sport_marketing_agency/` |
| Frontend dist | `/var/www/sport_marketing_agency/frontend/dist/` |
| Frontend .env | `/var/www/sport_marketing_agency/frontend/.env` |
| Backend .env | `/var/www/sport_marketing_agency/backend/.env` |
| Nginx config | `/etc/nginx/sites-available/sport_marketing` |
| SSL certs | `/etc/letsencrypt/live/globalmediasports.es/` |
| PM2 logs | `~/.pm2/logs/backend-*.log` |

---

## ⚡ Quick One-Liner (Full Redeploy)

```bash
ssh root@212.227.99.187 "cd /var/www/sport_marketing_agency && git pull && cd backend && npm install && npm run build && pm2 restart backend && cd ../frontend && npm install && npm run build"
```
