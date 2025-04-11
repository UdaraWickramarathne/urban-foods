import express from 'express';
import backupController from '../controllers/backupController.js';

const router = express.Router();

router.post('/', backupController.createBackup);
router.get('/', backupController.getAllBackups);
router.get('/:backupId/download', backupController.downloadBackup);

export default router;