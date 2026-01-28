# 🔧 Troubleshooting Guide

## Error: "Cannot GET /"

This error means the server can't find your HTML file. Here's how to fix it:

### Solution 1: Check File Structure

Make sure your files are organized like this:

```
task-logger-app/
├── server.js
├── schema.sql
├── package.json
└── public/
    └── index.html    ← Must be here!
```

**Fix:**
```bash
# If index.html is in wrong location, move it:
mkdir -p public
mv index.html public/
```

### Solution 2: Fresh Installation

```bash
# 1. Create a new folder
mkdir task-logger-app
cd task-logger-app

# 2. Copy all files ensuring this structure:
#    - server.js (in root)
#    - package.json (in root)
#    - schema.sql (in root)
#    - public/index.html (in public folder)

# 3. Install dependencies
npm install

# 4. Start server
npm start

# 5. Open browser
# Go to: http://localhost:3000
```

### Solution 3: Verify Server is Running

```bash
# Check if server started successfully
# You should see:
# "Server running on: http://localhost:3000"

# If you see "Port already in use":
# Kill existing node processes
pkill node
# Or use different port
PORT=3001 npm start
```

---

## Error: "Module not found"

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Error: "Cannot find module 'express'"

```bash
# Install dependencies
npm install express sqlite3 body-parser cors
```

---

## Error: "Database is locked"

```bash
# Stop all node processes
pkill -f node

# Delete database file and restart
rm tasklogger.db
npm start
```

---

## Error: "EADDRINUSE: Port 3000 is already in use"

**Option 1:** Kill the process using port 3000
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Option 2:** Use a different port
```bash
PORT=3001 npm start
```

---

## Browser Shows Blank Page

1. **Check Console (F12)**
   - Look for errors in browser console
   - Common: "Failed to fetch" means API isn't running

2. **Check Network Tab**
   - See if API calls are failing
   - Check if requests go to correct URL

3. **Verify Server is Running**
   ```bash
   # Test API directly
   curl http://localhost:3000/api/tasks
   ```

---

## "Failed to fetch" or "Network Error"

**Issue:** Frontend can't connect to backend

**Fix:** Make sure server is running first!

```bash
# Terminal 1: Start server
npm start

# Then open browser to http://localhost:3000
```

---

## Database Not Saving Data

1. **Check write permissions**
   ```bash
   chmod 755 .
   ```

2. **Verify database file created**
   ```bash
   ls -la tasklogger.db
   ```

3. **Test database directly**
   ```bash
   sqlite3 tasklogger.db "SELECT * FROM tasks;"
   ```

---

## Quick Diagnostic Commands

```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if port 3000 is in use
lsof -i :3000

# Check current directory structure
ls -la
ls -la public/

# Test server response
curl http://localhost:3000/api/tasks

# View server logs
# (They appear in the terminal where you ran 'npm start')
```

---

## Complete Reset (Nuclear Option)

If nothing works, start fresh:

```bash
# 1. Stop everything
pkill node

# 2. Delete everything except source files
rm -rf node_modules package-lock.json tasklogger.db

# 3. Verify file structure
ls -la
ls -la public/

# 4. Should see:
#    - server.js
#    - package.json  
#    - schema.sql
#    - public/index.html

# 5. Install fresh
npm install

# 6. Start
npm start

# 7. Open browser
# http://localhost:3000
```

---

## Still Not Working?

### Check These Common Issues:

1. ✅ **Node.js installed?**
   ```bash
   node --version
   # Should show v14.0.0 or higher
   ```

2. ✅ **Files in correct location?**
   ```bash
   ls -la public/index.html
   # Should exist
   ```

3. ✅ **Dependencies installed?**
   ```bash
   ls node_modules/
   # Should see folders: express, sqlite3, etc.
   ```

4. ✅ **Server actually started?**
   - Look for "Server running on..." message
   - No error messages in terminal

5. ✅ **Correct URL?**
   - Use: `http://localhost:3000`
   - NOT: `https://` (no 's')
   - NOT: `file:///` (not opening file directly)

---

## Testing the API Separately

You can test if the API works without the frontend:

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Test Task",
    "client": "Test Client", 
    "team": "Build",
    "user": "Venkatakamesh",
    "hours": 2,
    "minutes": 30,
    "start_date": "2026-01-28",
    "end_date": "2026-01-29",
    "status": "inprogress"
  }'
```

If these work, the backend is fine and it's a frontend issue.

---

## Windows-Specific Issues

### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Path Issues
Make sure you're in the correct directory:
```cmd
cd path\to\task-logger-app
dir
# Should see server.js, package.json, public folder
```

---

## Mac/Linux-Specific Issues

### Permission Denied
```bash
sudo npm install
# Or without sudo:
npm install --unsafe-perm
```

### Port Access
```bash
# If port 3000 needs sudo
sudo npm start
# Or use port > 1024
PORT=8080 npm start
```

---

## Need More Help?

If none of these solutions work:

1. **Copy the exact error message** from your terminal
2. **Take a screenshot** of the error in browser (F12 console)
3. **Show your file structure**: `ls -laR`
4. **Show dependencies**: `npm list`

This will help identify the specific issue!
