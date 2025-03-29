import express from 'express';
import customerController from '../controllers/customerController.js';
import imageUpload from '../middlewares/imageUpload.js';

const { memoryUpload } = imageUpload;

const { editCustomer, deleteCustomer, getCustomerById, getCustomers, getCustomersWithSpends } = customerController;

const router = express.Router();

router.get('/:customerId', getCustomerById);
router.put('/update/:customerId', memoryUpload.single('image') ,editCustomer);
router.delete('/delete/:customerId', deleteCustomer);
router.get('/', getCustomersWithSpends);


export default router;