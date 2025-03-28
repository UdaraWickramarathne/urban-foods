import express from 'express';
import productController from '../controllers/productController.js';
import imageUpload from "../middlewares/imageUpload.js";

const { productUpload } = imageUpload;

const { getAllProducts, getProductById, insertProduct, deleteProduct, updateProduct,searchProducts} = productController;

const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

router.get('/search', searchProducts);

// Route to get a product by ID
router.get('/:productId', getProductById);

// Route to insert a new product
router.post('/', productUpload.single("image"), insertProduct);

// Route to delete a product by ID
router.delete('/:productId', deleteProduct);

// Route to update a product by ID
router.put('/:productId', updateProduct);


export default router;