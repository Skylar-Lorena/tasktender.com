const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// System Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    app: 'TaskTender API Engine', 
    dbState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasktender';

// Connect to MongoDB prior to listening for requests
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('[DATABASE] MongoDB Connected successfully');
    app.listen(PORT, () => console.log(`[SERVER] Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('[DATABASE] Connection Error:', err.message);
    process.exit(1);
  });