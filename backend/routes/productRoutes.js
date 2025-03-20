import express from 'express';
import productController from '../controllers/productController.js';

const { getAllProducts, getProductById, insertProduct, deleteProduct, updateProduct} = productController;

const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

// Route to get a product by ID
router.get('/:productId', getProductById);

// Route to insert a new product
router.post('/', insertProduct);

// Route to delete a product by ID
router.delete('/:productId', deleteProduct);

// Route to update a product by ID
router.put('/:productId', updateProduct);


export default router;