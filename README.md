# Task Hour Logger Application

A full-stack task time tracking application with a Node.js backend and SQLite database.

## Features

- ✅ Track tasks with client, team, user, hours, dates, and status
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ SQLite database for persistent storage
- ✅ RESTful API
- ✅ Modern, responsive UI
- ✅ Real-time form validation

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Styling**: Custom CSS with modern design

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Get All Tasks
```
GET /api/tasks
```

### Get Single Task
```
GET /api/tasks/:id
```

### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "task": "Task name",
  "client": "Client name",
  "team": "Build" | "Imp",
  "user": "Venkatakamesh" | "Chandrashekar" | "Meenu",
  "hours": 8,
  "minutes": 30,
  "start_date": "2026-01-28",
  "end_date": "2026-01-29",
  "status": "yet to start" | "inprogress" | "completed"
}
```

### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  // Same structure as Create
}
```

### Delete Task
```
DELETE /api/tasks/:id
```

### Get Statistics
```
GET /api/stats
```

## Database Schema

The SQLite database (`tasklogger.db`) contains a single table:

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    client TEXT NOT NULL,
    team TEXT NOT NULL,
    user TEXT NOT NULL,
    hours INTEGER NOT NULL,
    minutes INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment Options

### Option 1: Deploy to Heroku

1. Create a Heroku account at https://heroku.com
2. Install Heroku CLI
3. Deploy:
```bash
heroku login
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Option 2: Deploy to Render

1. Create account at https://render.com
2. Connect your GitHub repository
3. Create new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`

### Option 3: Deploy to Railway

1. Create account at https://railway.app
2. Create new project
3. Deploy from GitHub or upload files
4. Railway will auto-detect Node.js and deploy

### Option 4: Deploy to DigitalOcean App Platform

1. Create account at https://digitalocean.com
2. Go to App Platform
3. Create new app from GitHub
4. Configure build and run commands

### Option 5: VPS Deployment (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your project
git clone your-repo-url
cd task-logger-app

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name task-logger

# Make it restart on reboot
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
sudo apt install nginx
# Configure nginx to proxy port 3000
```

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```

## Project Structure

```
task-logger-app/
├── server.js           # Express server and API routes
├── schema.sql          # Database schema
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html      # Frontend application
├── tasklogger.db       # SQLite database (created on first run)
└── README.md           # This file
```

## Environment Variables

For production, you can set:

```bash
PORT=3000  # Server port (default: 3000)
```

## Security Notes

For production deployment:
- Add authentication middleware
- Implement rate limiting
- Use HTTPS
- Add input sanitization
- Implement CORS properly for your domain
- Add environment-specific configurations

## License

MIT
