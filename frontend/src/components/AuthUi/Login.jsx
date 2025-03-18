import React, { useState } from "react";
import "./Login.css";
import Register from "./Register";

const LoginPage = ({ onClose }) => {
  const [showRegister, setShowRegister] = useState(false);

  const handleJoinClick = () => {
    setShowRegister(true);
  };

  return (
    <div className="modal-overlay">
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
                <img src="/no-nut.png" alt="Left Section Image" className="left-section-image" />
              </div>
              <div className="right-section">
                <h2>Sign in to your account</h2>
                <p>
                  Don’t have an account? <a href="#" onClick={handleJoinClick}>Join here</a>
                </p>
                <button className="google-btn">
                  Continue with Customer
                </button>
                <button className="email-btn">
                  Continue with Supplier
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoginPage;