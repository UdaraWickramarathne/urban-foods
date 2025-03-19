import express from 'express';
import userController from '../controllers/userController.js';

const { getUsers, registerCustomer, registerSupplier, login} = userController;

const router = express.Router();

router.get('/', getUsers);
router.post('/customer', registerCustomer);
router.post('/supplier', registerSupplier);
router.post('/login', login);

export default router;