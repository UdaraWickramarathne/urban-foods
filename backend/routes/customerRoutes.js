import express from 'express';
import customerController from '../controllers/customerController.js';

const { editCustomer, deleteCustomer, getCustomerById, getCustomers, getCustomersWithSpends } = customerController;

const router = express.Router();

router.get('/:customerId', getCustomerById);
router.put('/editCustomer/:customerId', editCustomer);
router.delete('/deleteCustomer/:customerId', deleteCustomer);
router.get('/', getCustomersWithSpends);


export default router;