import express from 'express';
import categoryController from '../controllers/categoryController.js';

const { addCategory, getAllCategories, deleteCategory, updateCategory  } = categoryController;


const router = express.Router();

router.get('/', getAllCategories);
router.post('/', addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

export default router;