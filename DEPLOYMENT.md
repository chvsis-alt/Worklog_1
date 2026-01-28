# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (Railway.app)

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click**: "New Project" → "Deploy from GitHub repo"
4. **Select**: Your repository (upload these files to GitHub first)
5. **Railway automatically**:
   - Detects Node.js
   - Installs dependencies
   - Starts your app
6. **You get**: A public URL like `https://your-app.railway.app`

**Done! Your app is live in ~2 minutes!**

---

## 📦 Alternative: Render.com (Also Free)

1. **Go to**: https://render.com
2. **Sign up** and connect GitHub
3. **New** → **Web Service**
4. **Connect** your repository
5. **Configure**:
   - Name: `task-logger`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Deploy**

**Your app URL**: `https://task-logger.onrender.com`

---

## 🔧 Local Testing First

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Start server
npm start

# Open browser to:
http://localhost:3000
```

---

## 📝 Pre-Deployment Checklist

Before pushing to GitHub:

1. **Create GitHub repo**:
```bash
git init
git add .
git commit -m "Task Logger Application"
git remote add origin https://github.com/yourusername/task-logger.git
git push -u origin main
```

2. **Verify files**:
- ✅ server.js
- ✅ schema.sql
- ✅ package.json
- ✅ public/index.html
- ✅ .gitignore

3. **Test locally** before deploying

---

## 🌐 Using a Custom Domain

### On Railway:
1. Go to your project settings
2. Click "Domains"
3. Add custom domain
4. Update DNS records as shown

### On Render:
1. Go to dashboard
2. Click "Custom Domain"
3. Follow DNS configuration steps

---

## 🔐 Production Checklist

For production use, consider adding:

- [ ] User authentication
- [ ] API rate limiting
- [ ] HTTPS (automatic on Railway/Render)
- [ ] Database backups
- [ ] Error monitoring (Sentry)
- [ ] Environment variables for secrets

---

## 💾 Database Persistence

**Important**: The SQLite database file will persist on:
- Railway: ✅ Yes (with volume)
- Render: ⚠️ Free tier may reset
- Heroku: ⚠️ Ephemeral filesystem

For production, consider upgrading to PostgreSQL (both platforms support it).

---

## 🆘 Troubleshooting

### Port Issues
If you see "Port already in use":
```bash
# Change port in server.js or set environment variable
PORT=3001 npm start
```

### Database Locked
```bash
# Stop all node processes
pkill -f node
# Restart
npm start
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📊 Monitoring Your App

Once deployed:

1. **Railway**: Built-in metrics in dashboard
2. **Render**: View logs in dashboard
3. **Check health**: Visit `/api/tasks` endpoint

---

## 🎉 You're Done!

Your task logger is now accessible worldwide. Share the URL with your team!
