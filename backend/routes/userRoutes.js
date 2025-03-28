import express from 'express';
import userController from '../controllers/userController.js';
import imageUpload from '../middlewares/imageUpload.js';

const { customerUpload } = imageUpload;

const { getUsers, registerCustomer, registerSupplier, login, registerAdmin, validateToken, deleteUser} = userController;

const router = express.Router();

router.get('/', getUsers);
router.post('/customer', customerUpload.single('image') ,registerCustomer);
router.post('/supplier', registerSupplier);
router.post('/login', login);
router.post('/admin', registerAdmin);
router.get('/validate-token', validateToken);
router.delete('/:userId', deleteUser);

export default router;