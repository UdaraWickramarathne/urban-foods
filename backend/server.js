import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import bodyParser from "body-parser";
import { connectToDatabase } from "./db/mongodbConnection.js";
import backupRoutes from './routes/backupRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(bodyParser.json());

// Connect to MongoDB
connectToDatabase();

app.get('/', (req, res) => {
    res.send('API is running...');
})

app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/backups', backupRoutes);

app.use("/api/images/products", express.static("uploads/products"));
app.use("/api/images/suppliers", express.static("uploads/suppliers"));
app.use("/api/images/customers", express.static("uploads/customers"));
app.use("/api/images/default", express.static("uploads/defaults"));

app.use('/api/suppliers', supplierRoutes);
app.use('/api/feedback', feedbackRoutes);
app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});