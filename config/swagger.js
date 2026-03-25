import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mool Granth API",
      version: "1.0.0",
      description: "REST API documentation for Mool Granth e-commerce platform",
    },
    servers: [
      {
        url: "https://moon-granth-web.vercel.app",
        description: "Production",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Product: {
          type: "object",
          required: ["name", "category", "price"],
          properties: {
            _id:         { type: "string",  example: "64f1a2b3c4d5e6f7g8h9i0j1" },
            name:        { type: "string",  example: "Cow Dung Powder" },
            category:    { type: "string",  example: "Organic Fertilizer" },
            price:       { type: "number",  example: 199 },
            description: { type: "string",  example: "100% organic cow dung powder" },
            images:      { type: "array", items: { type: "string" }, example: ["https://res.cloudinary.com/..."] },
            stock:       { type: "number",  example: 100 },
            isNew:       { type: "boolean", example: true },
            createdAt:   { type: "string",  format: "date-time" },
            updatedAt:   { type: "string",  format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id:       { type: "string" },
            name:      { type: "string",  example: "John Doe" },
            email:     { type: "string",  example: "john@example.com" },
            role:      { type: "string",  example: "user", enum: ["user", "admin"] },
            createdAt: { type: "string",  format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string",  example: "Error message" },
          },
        },
        // Add these inside components.schemas alongside Product, User, Error:

Review: {
  type: "object",
  properties: {
    _id:       { type: "string" },
    productId: { type: "string", example: "64f1a2b3c4d5e6f7g8h9i0j1" },
    userId:    { type: "string", example: "64f1a2b3c4d5e6f7g8h9i0j1" },
    rating:    { type: "number", example: 4 },
    comment:   { type: "string", example: "Great product!" },
    createdAt: { type: "string", format: "date-time" },
  },
},

Cart: {
  type: "object",
  properties: {
    _id:    { type: "string" },
    userId: { type: "string", example: "64f1a2b3c4d5e6f7g8h9i0j1" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity:  { type: "number", example: 2 },
        },
      },
    },
  },
},

Contact: {
  type: "object",
  properties: {
    _id:       { type: "string" },
    name:      { type: "string",  example: "John Doe" },
    email:     { type: "string",  example: "john@example.com" },
    phone:     { type: "string",  example: "+91 98765 43210" },
    message:   { type: "string",  example: "I would like to know more." },
    createdAt: { type: "string",  format: "date-time" },
  },
},

Order: {
  type: "object",
  properties: {
    _id:    { type: "string" },
    userId: { type: "string", example: "64f1a2b3c4d5e6f7g8h9i0j1" },
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity:  { type: "number", example: 2 },
        },
      },
    },
    totalAmount:   { type: "number",  example: 598 },
    address:       { type: "string",  example: "123 Main St, Ahmedabad" },
    paymentMethod: { type: "string",  example: "COD", enum: ["COD", "Online"] },
    status:        { type: "string",  example: "Pending", enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
    createdAt:     { type: "string",  format: "date-time" },
  },
},
      },
    },
  },
  // Scan these files for JSDoc @swagger comments
  apis: ["./routes/*.js", "./controller/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;