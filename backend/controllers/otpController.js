import { sendOtp, verifyOtp } from '../services/otpService.js';
import HttpStatus from '../enums/httpsStatus.js';
import customerRepository from '../repositories/customerRepository.js';
import supplierRepository from '../repositories/supplierRepository.js';

const requestOtp = async (req, res) => {
  const { email } = req.body;
  const isEmailExists = await customerRepository.getCustomerByEmail(email);
  if (isEmailExists) {
    return res.status(HttpStatus.BAD_REQUEST).json({success: false , message: 'Email is already used!' });
  }
  const isEmailExistsInSuppliers = await supplierRepository.getSupplierByEmail(email);
  if (isEmailExistsInSuppliers) {
    return res.status(HttpStatus.BAD_REQUEST).json({success: false , message: 'Email is already used!' });
  }
  try {
    await sendOtp(email);
    res.status(HttpStatus.OK).json({success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false , message: 'Failed to send OTP' });
  }
};

const validateOtp = (req, res) => {
  const { email, otp } = req.body;
  if (verifyOtp(email, otp)) {
    res.status(HttpStatus.OK).json({ success: true , message: 'OTP verified successfully' });
  } else {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false , message: 'Invalid OTP' });
  }
};

export default { requestOtp, validateOtp };