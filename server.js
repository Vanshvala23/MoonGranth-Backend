import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import contactRoutes from "./routes/contactRoute.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// ===================== MIDDLEWARE =====================

// CORS Configuration
app.use(cors({
  origin: [
    "https://moon-granth-web.vercel.app",
    "http://localhost:5173",  // For local development
    "http://localhost:3000"   // Alternative local port
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  maxAge: 86400 // 24 hours
}));

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request Logger (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  });
}

// ===================== DATABASE CONNECTION =====================
connectDB();

// ===================== HEALTH CHECK ROUTES =====================

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Moon Granth API',
    status: 'active',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'connected' // You can add actual DB check here
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    environment: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI ? '✅ Set' : '❌ Missing',
    jwtSecret: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
  });
});

// ===================== API ROUTES =====================

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/review', reviewRoutes);

// ===================== ERROR HANDLING =====================

// 404 Handler - Must be after all routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/products',
      '/api/auth',
      '/api/orders',
      '/api/cart',
      '/api/contact',
      '/api/review'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
});

// ===================== SERVER STARTUP =====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS enabled for: https://moon-granth-web.vercel.app`);
  console.log('🚀 ================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

export default app; // Export for Vercel serverless