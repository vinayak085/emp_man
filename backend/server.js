import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      // or if origin matches client URL / localhost
      if (!origin || origin.startsWith('http://localhost') || origin === clientUrl) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/testing, can restrict if needed
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatusMap[mongoose.connection.readyState] || 'unknown',
  });
});

// Employee API routes
app.use('/api/employees', employeeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Employee Management System API',
    endpoints: {
      health: '/api/health',
      employees: '/api/employees',
      stats: '/api/employees/stats',
    },
  });
});

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server if not imported by test suite
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`[Server] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
        console.log(`[Server] Employees API: http://localhost:${PORT}/api/employees`);
      });
    })
    .catch((err) => {
      console.error('[Server Error] Failed to start server:', err.message);
      process.exit(1);
    });
}

export default app;
