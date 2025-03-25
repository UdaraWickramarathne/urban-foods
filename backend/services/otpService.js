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

  // HTML template for the email
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .app-name {
          color:#4CAF50;
          font-size: 24px;
          font-weight: bold;
        }
        p{
          color: #333333;
        }
        .otp-box {
          background-color:#4CAF50;
          color: white;
          padding: 10px 15px;
          font-size: 18px;
          display: inline-block;
          margin: 15px 0;
          border-radius: 4px;
        }
        .warning {
          font-weight: bold;
          color:rgb(255, 138, 138);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="app-name">Urban Food</span>
        </div>
        
        <p>Hello User,</p>
        
        <p>Thank you for choosing Urban Food. Use this OTP to complete your Sign Up procedures and verify your account on Appname.</p>
        
        <p class="warning">Remember, Never share this OTP with anyone, not even if Appname ask to you.</p>
        
        <div class="otp-box">${otp}</div>
        
        <p>Regards,<br>Team Urban Food</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`, // Plain text version as fallback
    html: htmlTemplate // HTML version
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