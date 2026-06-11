const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// add later
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});