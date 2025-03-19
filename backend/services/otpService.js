import nodemailer from 'nodemailer';
import crypto from 'crypto';

const otps = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  otps.set(email, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const verifyOtp = (email, otp) => {
  const storedOtp = otps.get(email);
  if (storedOtp === otp) {
    otps.delete(email);
    return true;
  }
  return false;
};

export { sendOtp, verifyOtp };