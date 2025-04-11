import { sendOtp, verifyOtp } from '../services/otpService.js';
import HttpStatus from '../enums/httpsStatus.js';
import userRepository from '../repositories/userRepository.js';


const requestOtp = async (req, res) => {
  const { email } = req.body;
  const isEmail = await userRepository.checkEmailExists(email);
  if(isEmail.exists){
    return res.status(HttpStatus.BAD_REQUEST).json({success: false , message: 'Email already exists' });
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