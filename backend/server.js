import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

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
app.use("/api/deliveries", deliveryRoutes);

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
})