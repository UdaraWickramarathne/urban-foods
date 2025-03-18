import React, { useState } from "react";
import "./Register.css";
import LoginPage from "./Login";

const Register = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const handleSendOtp = () => {
    console.log(`OTP sent to ${email}`);
  };

  const handleVerifyOtp = () => {
    console.log(`OTP Verified: ${otp}`);
    alert("Registration Successful!");
  };

  const handleSignInClick = () => {
    setShowLogin(true);
  };

  const handleContinueClick = () => {
    setShowEmailPassword(true);
  };

  return (
    <div className="register-container">
      {showLogin ? (
        <LoginPage onClose={() => setShowLogin(false)} />
      ) : (
        <div className="register-box">
          <div className="register-left">
            <h2>Create Now</h2>
            <ul>
              <li>✔ Over 700 categories</li>
              <li>✔ Organic And Fresh</li>
              <li>✔ Over 1400 Supplier</li>
            </ul>
            <img src="/no-nut.png" alt="Left Section Image" className="left-section-image" />
          </div>
          <div className="register-right">
            {step === 1 ? (
              <>
                {!showEmailPassword ? (
                  <>
                    <h2>Create a new account</h2>
                    <p>
                      Already have an account? <a href="#" onClick={handleSignInClick}>Sign in</a>
                    </p>
                    <button className="google-btn" onClick={handleContinueClick}>
                      Continue with Customer
                    </button>
                    <button className="email-btn" onClick={handleContinueClick}>
                      Continue with Supplier
                    </button>
                  </>
                ) : (
                  <>
                    <h2>Create a new account</h2>
                    <p>
                      Already have an account? <a href="#" onClick={handleSignInClick}>Sign in</a>
                    </p>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Enter your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                    <button onClick={handleSendOtp} className="continue-btn">
                      Continue
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <h2>Enter OTP</h2>
                <p>We have sent a code to {email}</p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field"
                />
                <button onClick={handleVerifyOtp} className="verify-btn">
                  Verify & Continue
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default Register;