import express from 'express';
import supplierController from '../controllers/supplierController.js';
import imageUpload from '../middlewares/imageUpload.js';

const {supplierUpload, memoryUpload} = imageUpload;

const router = express.Router();

router.get('/', supplierController.getAllSuppliersWithDetails);
router.put('/:supplierId', memoryUpload.single('image'), supplierController.updateSupplier);
router.delete('/:supplierId', supplierController.deleteSupplier);
router.post('/', supplierUpload.single('image'), supplierController.addSupplier);
router.get('/:supplierId', supplierController.getSupplierById);

export default router;