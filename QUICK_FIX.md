# ⚡ QUICK FIX: "Cannot GET /" Error

## The Problem
Your server can't find the index.html file.

## The Solution (3 Steps)

### Step 1: Check Your Folder Structure

Open your project folder and make sure it looks like this:

```
task-logger-app/
├── server.js          ← Must be here
├── package.json       ← Must be here  
├── schema.sql         ← Must be here
└── public/            ← Must have this folder
    └── index.html     ← Must be inside public/
```

### Step 2: Move Files if Needed

**If index.html is NOT in the public folder:**

**On Windows (Command Prompt):**
```cmd
mkdir public
move index.html public\index.html
```

**On Mac/Linux (Terminal):**
```bash
mkdir -p public
mv index.html public/
```

### Step 3: Restart Server

```bash
# Stop server (Press Ctrl+C in the terminal)

# Start again
npm start

# Open browser to:
http://localhost:3000
```

---

## Still Not Working?

### Option A: Use the Startup Script

**On Windows:**
Double-click `start.bat`

**On Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option B: Fresh Start

```bash
# 1. Stop server (Ctrl+C)

# 2. Kill any remaining processes
pkill node

# 3. Delete and reinstall
rm -rf node_modules
npm install

# 4. Start server
npm start
```

---

## Verification Checklist

Before starting the server, verify:

- [ ] ✅ `server.js` exists in root folder
- [ ] ✅ `package.json` exists in root folder
- [ ] ✅ `public/` folder exists
- [ ] ✅ `public/index.html` exists inside public folder
- [ ] ✅ Ran `npm install` successfully
- [ ] ✅ No other process using port 3000

---

## Test Your Setup

After starting the server, you should see:

```
╔════════════════════════════════════════════╗
║   Task Hour Logger Server Started!        ║
╚════════════════════════════════════════════╝

🚀 Server running on: http://localhost:3000
📊 API endpoint: http://localhost:3000/api/tasks
```

If you see this, open your browser to `http://localhost:3000`

---

## Common Mistakes

❌ **Wrong:** `index.html` in root folder  
✅ **Correct:** `index.html` in `public/` folder

❌ **Wrong:** Typing `https://localhost:3000` (with 's')  
✅ **Correct:** `http://localhost:3000` (no 's')

❌ **Wrong:** Opening `index.html` file directly in browser  
✅ **Correct:** Start server first, then visit `http://localhost:3000`

---

## Need More Help?

See `TROUBLESHOOTING.md` for detailed solutions to all errors.
