import express from 'express';
import userController from '../controllers/userController.js';

const { getUsers, registerCustomer, registerSupplier, login, registerAdmin, validateToken} = userController;

const router = express.Router();

router.get('/', getUsers);
router.post('/customer', registerCustomer);
router.post('/supplier', registerSupplier);
router.post('/login', login);
router.post('/admin', registerAdmin);
router.get('/validate-token', validateToken);

export default router;