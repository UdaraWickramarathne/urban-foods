import express from 'express';
import userController from '../controllers/userController.js';

const { getUsers } = userController;

const router = express.Router();

router.get('/', getUsers);

export default router;