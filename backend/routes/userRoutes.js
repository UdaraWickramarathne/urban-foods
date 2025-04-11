import express from 'express';
import userController from '../controllers/userController.js';
import imageUpload from '../middlewares/imageUpload.js';

const { memoryUpload } = imageUpload;

const { getUsers, registerCustomer, registerSupplier, login, registerAdmin, validateToken, deleteUser, saveDeliveryAgent} = userController;

const router = express.Router();

router.get('/', getUsers);
router.post('/customer', memoryUpload.single('image'), registerCustomer);
router.post('/supplier',memoryUpload.single('image'), registerSupplier);
router.post('/del-agent', saveDeliveryAgent);
router.post('/login', login);
router.post('/admin', registerAdmin);
router.get('/validate-token', validateToken);
router.delete('/:userId', deleteUser);

export default router;