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
const db = new sqlite3.Database('./tasklogger.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database with schema
function initializeDatabase() {
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
        } else {
            console.log('Database initialized successfully');
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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/tasks`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
