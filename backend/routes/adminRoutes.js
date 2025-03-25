import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/', adminController.addOrcleUser);

export default router;