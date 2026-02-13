import e from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import contactRoutes from "./routes/contactRoute.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = e();
app.use(cors());
connectDB();
app.use(e.json());


app.use('/api/products', productRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/contact',contactRoutes);
app.use('/api/review',reviewRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})