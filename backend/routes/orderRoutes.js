import express from 'express';
import orderController from '../controllers/orderController.js';

const { getOrders, getOrderItems, addOrder } = orderController;

const router = express.Router();

router.get('/', getOrders);
router.get('/:orderId/items', getOrderItems);
router.post('/', addOrder);

export default router;