import express from 'express';
import supplierController from '../controllers/supplierController.js';


const router = express.Router();

router.get('/', supplierController.getAllSuppliersWithDetails);

export default router;