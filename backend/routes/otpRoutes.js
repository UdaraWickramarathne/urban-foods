import express from 'express';
import otpController from '../controllers/otpController.js';

const { requestOtp, validateOtp } = otpController;

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/validate-otp', validateOtp);

export default router;