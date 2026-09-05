const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory "database" — resets every time the server restarts.
// email -> password
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock auth backend listening on http://localhost:${PORT}`);
});