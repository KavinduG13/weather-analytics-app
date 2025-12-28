require('dotenv').config();

const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      domain: process.env.AUTH0_DOMAIN,
      audience: process.env.AUTH0_AUDIENCE
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('\nERROR CAUGHT:');
  console.error('Message:', err.message);
  console.error('Status:', err.status);
  console.error('Name:', err.name);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
    name: err.name
  });
});

app.listen(PORT, () => {
  console.log(`\nServer running on PORT:${PORT}`);
});