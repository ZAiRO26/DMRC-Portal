/**
 * MetroPortal Backend - Express Server
 * Main entry point for the API server
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import metroRoutes from './routes/metro.routes.js';
import { startTrainDataSync } from './jobs/trainDataSync.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// MIDDLEWARE CONFIGURATION
// =============================================================================

// Enable CORS for Unity WebGL and frontend
app.use(cors({
  origin: [
    'http://localhost:5173',      // Vite dev server
    'http://localhost:3001',      // Alternative frontend port
    'https://metroportal.netlify.app',  // Production frontend
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Rate limiting - max 2 requests/second per IP (120/minute)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 120,
  message: {
    error: 'Too many requests',
    message: 'Please wait before making more requests',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// =============================================================================
// ROUTES
// =============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/v1/metro', metroRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🚇 MetroPortal Backend Server');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   ✅ Server running on http://localhost:${PORT}`);
  console.log(`   📡 API Base URL: http://localhost:${PORT}/api/v1/metro`);
  console.log(`   🔒 Rate Limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 120} requests/minute`);
  console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════════════════════════════');
  
  // Start the cron job for syncing train data
  startTrainDataSync();
});

export default app;
