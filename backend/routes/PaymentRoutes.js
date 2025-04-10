import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.patch('/updatePaymentStatus', paymentController.updateCardPaymentStatus);
 

export default router;