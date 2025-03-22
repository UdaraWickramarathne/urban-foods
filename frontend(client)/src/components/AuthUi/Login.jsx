import React from "react";
import "./Login.css";

const LoginPage = ({ onClose, onSwitchToRegister }) => {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="container">
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
                Don’t have an account?{" "}
                <a href="#" onClick={onSwitchToRegister}>
                  Join here
                </a>
              </p>
              <input type="email" placeholder="Enter your email" className="input-field" />
              <input type="password" placeholder="Enter your password" className="input-field" />
              <button className="continue-btn">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;