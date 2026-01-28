const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
let db = new sqlite3.Database('./tasklogger.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database with schema
function initializeDatabase() {
    const schema = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            client TEXT NOT NULL,
            team TEXT NOT NULL CHECK(team IN ('Build', 'Imp')),
            user TEXT NOT NULL CHECK(user IN ('Venkatakamesh', 'Chandrashekar', 'Meenu')),
            hours INTEGER NOT NULL CHECK(hours >= 0),
            minutes INTEGER NOT NULL CHECK(minutes >= 0 AND minutes < 60),
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('yet to start', 'inprogress', 'completed')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user);
        CREATE INDEX IF NOT EXISTS idx_tasks_team ON tasks(team);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_dates ON tasks(start_date, end_date);

        CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp 
        AFTER UPDATE ON tasks
        BEGIN
            UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
    `;
    
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
        } else {
            console.log('✅ Database initialized successfully');
        }
    });
}

// API Endpoints

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

// Get single task by ID
app.get('/api/tasks/:id', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ task: row });
    });
});

// Create new task
app.post('/api/tasks', (req, res) => {
    const { task, client, team, user, hours, minutes, start_date, end_date, status } = req.body;
    
    // Validation
    if (!task || !client || !team || !user || hours === undefined || minutes === undefined || !start_date || !end_date || !status) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const sql = `INSERT INTO tasks (task, client, team, user, hours, minutes, start_date, end_date, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [task, client, team, user, hours, minutes, start_date, end_date, status], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Task created successfully',
            task: {
                id: this.lastID,
                task,
                client,
                team,
                user,
                hours,
                minutes,
                start_date,
                end_date,
                status
            }
        });
    });
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const { task, client, team, user, hours, minutes, start_date, end_date, status } = req.body;
    
    // Validation
    if (!task || !client || !team || !user || hours === undefined || minutes === undefined || !start_date || !end_date || !status) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const sql = `UPDATE tasks 
                 SET task = ?, client = ?, team = ?, user = ?, hours = ?, minutes = ?, 
                     start_date = ?, end_date = ?, status = ?
                 WHERE id = ?`;
    
    db.run(sql, [task, client, team, user, hours, minutes, start_date, end_date, status, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({
            message: 'Task updated successfully',
            changes: this.changes
        });
    });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({
            message: 'Task deleted successfully',
            changes: this.changes
        });
    });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_tasks,
            SUM(hours * 60 + minutes) as total_minutes,
            team,
            status
        FROM tasks
        GROUP BY team, status
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ stats: rows });
    });
});

// Export to Excel endpoint
app.get('/api/export', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Create CSV content
        const headers = ['ID', 'Task', 'Client', 'Team', 'User', 'Hours', 'Minutes', 'Start Date', 'End Date', 'Status', 'Created At', 'Updated At'];
        const csvRows = [headers.join(',')];
        
        rows.forEach(row => {
            const values = [
                row.id,
                `"${row.task.replace(/"/g, '""')}"`,
                `"${row.client.replace(/"/g, '""')}"`,
                row.team,
                row.user,
                row.hours,
                row.minutes,
                row.start_date,
                row.end_date,
                row.status,
                row.created_at,
                row.updated_at
            ];
            csvRows.push(values.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=task-logs-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvContent);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🚀 Task Hour Logger Server Started!     ║
╚════════════════════════════════════════════╝

📍 Local:            http://localhost:${PORT}
📊 API Endpoint:     http://localhost:${PORT}/api/tasks
📁 Static Files:     ${path.join(__dirname, 'public')}
💾 Database:         ${path.join(__dirname, 'tasklogger.db')}

✨ Server is ready! Open your browser to http://localhost:${PORT}

Press Ctrl+C to stop the server
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('\n✅ Database connection closed');
        }
        process.exit(0);
    });
});
