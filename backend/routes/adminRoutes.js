import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/users', adminController.addOrcleUser);
router.post('/login', adminController.adminLogin);
router.get('/permissions/:userId', adminController.getUserPermissions);

export default router;