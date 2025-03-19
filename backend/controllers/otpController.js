import { sendOtp, verifyOtp } from '../services/otpService.js';
import HttpStatus from '../enums/httpsStatus.js';

const requestOtp = async (req, res) => {
  const { email } = req.body;
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