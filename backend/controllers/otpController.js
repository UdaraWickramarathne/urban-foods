import { sendOtp, verifyOtp } from '../services/otpService.js';
import HttpStatus from '../enums/httpsStatus.js';
import userRepository from '../repositories/userRepository.js';


const requestOtp = async (req, res) => {
  console.log('Request OTP:', req.body);
  
  const { email } = req.body;
  if (!email) {
    return res.status(HttpStatus.BAD_REQUEST).json({success: false, message: 'Email address is required to send the verification code.' });
  }
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
    res.status(HttpStatus.BAD_REQUEST).json({ 
      success: false, 
      message: 'Invalid or expired OTP. Please double-check the code or request a new one.' 
    });
  }
};

export default { requestOtp, validateOtp };