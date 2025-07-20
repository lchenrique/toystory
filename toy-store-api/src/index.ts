import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase, disconnectDatabase } from './utils/database';
import { config } from './config/env';

// Import routes
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import saleRoutes from './routes/saleRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

export const app: express.Application = express();
const PORT = config.server.port;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Toy Store API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/statistics', statisticsRoutes);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await disconnectDatabase();
  process.exit(0);
});

// Start server only if this file is run directly
if (require.main === module) {
  async function startServer() {
    try {
      await connectDatabase();
      
      app.listen(PORT, () => {
        console.log(`🚀 Toy Store API running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
        console.log(`👥 Customer endpoints: http://localhost:${PORT}/api/customers`);
        console.log(`💰 Sale endpoints: http://localhost:${PORT}/api/sales`);
        console.log(`📈 Statistics endpoints: http://localhost:${PORT}/api/statistics`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  startServer();
} 