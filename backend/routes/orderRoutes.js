import express from 'express';
import orderController from '../controllers/orderController.js';

const { getOrders, getOrderItems, addOrder, getOrdersByUserId, updateOrderStatus, getTotalSales, getOrderCount } = orderController;

const router = express.Router();

router.get('/', getOrders);
router.get('/totalSales', getTotalSales);
router.get('/orderCount', getOrderCount);
router.get('/:orderId/items', getOrderItems);
router.post('/', addOrder);
router.get('/:userId', getOrdersByUserId );
router.patch('/:orderId', updateOrderStatus);

export default router;