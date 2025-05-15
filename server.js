const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // default XAMPP username
  password: '',       // default XAMPP password is empty
  database: 'todo_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// API endpoints
// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add new task
app.post('/tasks', (req, res) => {
  const { title, description, priority, due_date } = req.body;
  const query = 'INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, priority, due_date], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, ...req.body });
  });
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const { title, description, priority, due_date, is_completed } = req.body;
  const query = 'UPDATE tasks SET title=?, description=?, priority=?, due_date=?, is_completed=? WHERE id=?';
  db.query(query, [title, description, priority, due_date, is_completed, req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: 'Task updated' });
  });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id=?', [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: 'Task deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});