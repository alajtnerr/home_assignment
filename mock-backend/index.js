const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------
// Auth (Task 2) — unchanged
// ---------------------------------------------------------------------

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

const users = new Map();

app.post('/api/register', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  if (users.has(email)) {
    return res.status(409).json({ error: 'A user with this email already exists.' });
  }

  users.set(email, password);
  return res.status(201).json({ email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const storedPassword = users.get(email);

  if (!storedPassword || storedPassword !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.status(200).json({ email });
});

app.delete('/api/users/:email', (req, res) => {
  const { email } = req.params;
  users.delete(email);
  return res.status(204).send();
});

// ---------------------------------------------------------------------
// Tasks (Task 3) — in-memory task management API
// ---------------------------------------------------------------------

// id -> { id, title, description, completed }
const tasks = new Map();

app.post('/api/tasks', (req, res) => {
  const { title, description, completed } = req.body || {};

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string.' });
  }

  const task = {
    id: randomUUID(),
    title,
    description: description ?? '',
    completed: completed ?? false,
  };
  tasks.set(task.id, task);

  return res.status(201).json(task);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.get(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  return res.status(200).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.get(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { title, description, completed } = req.body || {};

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  tasks.set(task.id, task);

  return res.status(200).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const existed = tasks.delete(req.params.id);

  if (!existed) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  return res.status(204).send();
});

// ---------------------------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});