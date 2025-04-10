import express from 'express';
import orderController from '../controllers/orderController.js';

const { getOrders, getOrderItems, addOrder, getOrdersByUserId, updateOrderStatus, getTotalSales } = orderController;

const router = express.Router();

router.get('/', getOrders);
router.get('/totalSales', getTotalSales);
router.get('/:orderId/items', getOrderItems);
router.post('/', addOrder);
router.get('/:userId', getOrdersByUserId );
router.patch('/:orderId', updateOrderStatus);

export default router;