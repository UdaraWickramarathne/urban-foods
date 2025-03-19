import express from 'express';
import userController from '../controllers/userController.js';

const { getUsers, registerCustomer} = userController;

const router = express.Router();

router.get('/', getUsers);
router.post('/customer', registerCustomer);

export default router;