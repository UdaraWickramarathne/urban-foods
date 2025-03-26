import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';


const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
})

app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/category", categoryRoutes);
app.use("/images/products", express.static("uploads/products"));
app.use("/api/admin", adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/cart", cartRoutes);


app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});