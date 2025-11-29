const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database configuration
const connectDB = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const materialRoutes = require('./src/routes/materials');
const purchaseRoutes = require('./src/routes/purchases');
const logRoutes = require('./src/routes/logs');

// Import Swagger
const { specs, swaggerUi } = require('./src/config/swagger');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
// Enable CORS for production
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://apostilas-online.onrender.com' // Frontend URL
  ],
  credentials: true
}));
app.use(morgan('combined')); // Logging

// Debug middleware - log all requests
app.use((req, res, next) => {
  if (req.path.includes('/checkout')) {
    console.log('🔍 DEBUG - Request recebida:', {
      method: req.method,
      path: req.path,
      contentType: req.headers['content-type'],
      bodyBefore: req.body
    });
  }
  next();
});

app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

// Debug middleware - log after parsing
app.use((req, res, next) => {
  if (req.path.includes('/checkout')) {
    console.log('🔍 DEBUG - Após parsing:', {
      bodyAfter: req.body,
      bodyType: typeof req.body,
      bodyKeys: Object.keys(req.body || {})
    });
  }
  next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/logs', logRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Apostilas Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Necessário para Render e outros serviços de cloud

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;