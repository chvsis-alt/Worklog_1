-- Task Logger Database Schema

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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON tasks(team);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_dates ON tasks(start_date, end_date);

-- Trigger to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp 
AFTER UPDATE ON tasks
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
