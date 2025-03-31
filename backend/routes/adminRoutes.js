import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/users', adminController.addOrcleUser);
router.post('/login', adminController.adminLogin);
router.get('/permissions/:userId', adminController.getUserPermissions);
router.get('/', adminController.getAllDbUsers);
router.get('/current-privileges/:username', adminController.getCurrentPermissions);
router.put('/users',adminController.updateDbUser);
router.delete('/users/:username', adminController.deleteDbUser);


// * Get all triggers
router.get('/triggers', adminController.getAllTrigger);
router.post('/log', adminController.getLogDetails);
router.delete('/triggers/:triggerName', adminController.dropTrigger);
router.put('/triggers/:triggerName', adminController.changeTriggerStatus);

export default router;