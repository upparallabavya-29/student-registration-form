const path = require('path');
const express = require('express');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'EduEnroll API Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/students', studentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});


app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduEnroll Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check available at http://localhost:${PORT}/api/health`);
  console.log(`🎓 Students API available at http://localhost:${PORT}/api/students`);
});
