import express from 'express';
import productController from '../controllers/productController.js';
import imageUpload from "../middlewares/imageUpload.js";

const { memoryUpload } = imageUpload;

const { getAllProducts, getProductById, insertProduct, deleteProduct, updateProduct,searchProducts, getProductsBySupplierId} = productController;

const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

router.get('/search', searchProducts);

// Route to get a product by ID
router.get('/:productId', getProductById);

// Route to insert a new product
router.post('/', memoryUpload.single("image"), insertProduct);

// Route to delete a product by ID
router.delete('/:productId', deleteProduct);

// Route to update a product by ID
router.put('/:productId', memoryUpload.single("image"), updateProduct);

// Route to get products by supplier ID
router.get('/supplier/:supplierId', getProductsBySupplierId);


export default router;