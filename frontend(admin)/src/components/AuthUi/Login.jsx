import React, { useState } from "react";
import "./Login.css";
import Register from "./Register";

const LoginPage = ({ onClose }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const handleJoinClick = () => {
    setShowRegister(true);
  };

  const handleContinueClick = () => {
    setShowEmailPassword(true);
  };

  const handleBackClick = () => {
    setShowEmailPassword(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="container">
          {showRegister ? (
            <Register />
          ) : (
            <div className="card">
              <div className="left-section">
                <h2>Sign in here</h2>
                <ul>
                  <li>✔ Over 700 categories</li>
                  <li>✔ Organic And Fresh</li>
                  <li>✔ Over 1400 Supplier</li>
                </ul>
              </div>
              <div className="right-section">
                <h2>Sign in to your account</h2>
                <p>
                  Don’t have an account? <a href="#" onClick={handleJoinClick}>Join here</a>
                </p>
                {showEmailPassword ? (
                  <>
                    <input type="email" placeholder="Enter your email" className="input-field" />
                    <input type="password" placeholder="Enter your password" className="input-field" />
                    <button className="continue-btn">Continue</button>
                    <button className="back-btn" onClick={handleBackClick}>Back</button>
                  </>
                ) : (
                  <>
                    <button className="google-btn" onClick={handleContinueClick}>
                      Continue with Customer
                    </button>
                    <button className="email-btn" onClick={handleContinueClick}>
                      Continue with Supplier
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;