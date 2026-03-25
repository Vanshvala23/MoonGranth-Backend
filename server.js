import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import contactRoutes from "./routes/contactRoute.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

// ===================== MIDDLEWARE =====================

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://moon-granth-web.vercel.app",
      "https://moolgranth.com/",
      "http://localhost:5173",
      "http://localhost:3000",
    ];
    // Allow Postman, mobile apps, curl (no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  maxAge: 86400,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request Logger (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ===================== DATABASE =====================
connectDB();

// ===================== SWAGGER UI =====================
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Mool Granth API Docs",
    customCss: `
      .swagger-ui .topbar { background-color: #1a4731; }
      .swagger-ui .topbar-wrapper img { display: none; }
      .swagger-ui .topbar-wrapper::after {
        content: "🌿 Mool Granth API Documentation";
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 10px;
      }
    `,
    swaggerOptions: {
      persistAuthorization: true,    // remembers JWT between refreshes
      displayRequestDuration: true,  // shows response time in ms
      filter: true,                  // search bar across endpoints
      tryItOutEnabled: true,         // auto-enables "Try it out"
      docExpansion: "none",          // all tags collapsed by default
    },
  })
);

// Serve raw Swagger JSON — import directly into Postman
app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ===================== HEALTH ROUTES =====================

app.get("/", (req, res) => {
  res.json({
    message: "Mool Granth API",
    status: "active",
    version: "1.0.0",
    docs: "/api/docs",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    services: {
      mongo:      process.env.MONGO_URI             ? "✅ Set" : "❌ Missing",
      jwt:        process.env.JWT_SECRET            ? "✅ Set" : "❌ Missing",
      cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
    },
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    environment: process.env.NODE_ENV || "development",
    mongo:      process.env.MONGO_URI             ? "✅ Set" : "❌ Missing",
    jwt:        process.env.JWT_SECRET            ? "✅ Set" : "❌ Missing",
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
  });
});

// ===================== API ROUTES =====================

app.use("/api/products", productRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/contact",  contactRoutes);
app.use("/api/review",   reviewRoutes);

// ===================== ERROR HANDLING =====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    docs: "Visit /api/docs for all available routes",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ success: false, message: "File too large. Max 10mb allowed." });

  if (err.code === "LIMIT_UNEXPECTED_FILE")
    return res.status(400).json({ success: false, message: "Unexpected file field." });

  if (err.message?.startsWith("CORS blocked"))
    return res.status(403).json({ success: false, message: err.message });

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists.` });
  }

  if (err.name === "JsonWebTokenError")
    return res.status(401).json({ success: false, message: "Invalid token." });

  if (err.name === "TokenExpiredError")
    return res.status(401).json({ success: false, message: "Token expired." });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ===================== SERVER STARTUP =====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 ================================");
  console.log(`✅ Server running on port   ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📖 Swagger Docs:  http://localhost:${PORT}/api/docs`);
  console.log(`📄 Swagger JSON:  http://localhost:${PORT}/api/docs.json`);
  console.log(`☁️  Cloudinary:   ${process.env.CLOUDINARY_NAME || "❌ Not set"}`);
  console.log("🚀 ================================");
});

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

export default app;