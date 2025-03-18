import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
})

app.use("/api/users", userRoutes);

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
})