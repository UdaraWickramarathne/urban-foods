import express from 'express';
import customerController from '../controllers/customerController.js';

const { editCustomer, deleteCustomer, getCustomerById } = customerController;

const router = express.Router();

router.get('/:customerId', getCustomerById);
router.put('/editCustomer/:customerId', editCustomer);
router.delete('/deleteCustomer/:customerId', deleteCustomer);

export default router;