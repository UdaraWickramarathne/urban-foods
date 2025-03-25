import { sendOtp, verifyOtp } from '../services/otpService.js';
import HttpStatus from '../enums/httpsStatus.js';
import customerRepository from '../repositories/customerRepository.js';

const requestOtp = async (req, res) => {
  const { email } = req.body;
  const isEmailExists = await customerRepository.getCustomerByEmail(email);
  if (isEmailExists) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email is Allready Use' });
  }
  try {
    await sendOtp(email);
    res.status(HttpStatus.OK).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send OTP' });
  }
};

const validateOtp = (req, res) => {
  const { email, otp } = req.body;
  if (verifyOtp(email, otp)) {
    res.status(HttpStatus.OK).json({ message: 'OTP verified successfully' });
  } else {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid OTP' });
  }
};

export default { requestOtp, validateOtp };