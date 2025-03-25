import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import loadingImage from "../../images/loading.gif";

const Register = ({ onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/otp/request-otp", { email });
      if (response.status === 200) {
        setStep(2);
        setError("");
      }
    } catch (error) {
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/otp/validate-otp", { email, otp });
      if (response.status === 200) {
        setStep(3);
        setError("");
      }
    } catch (error) {
      setError("Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/otp/request-otp", { email });
      if (response.status === 200) {
        setError("OTP resent successfully");
      }
    } catch (error) {
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueClick = (type) => {
    setUserType(type);
    setShowEmailPassword(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBackClick = () => {
    if (step === 2) {
      setStep(1);
      setShowEmailPassword(false);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Validate input fields
      if (userType === "customer") {
        if (!name || !telephone || !address) {
          setError("Please fill in all required fields");
          setIsLoading(false);
          return;
        }
        
        // Make API call to register customer
        const response = await axios.post("http://localhost:5000/api/users/register-customer", {
          username: email,
          password: password,
          firstName: name.split(' ')[0], // Assuming first name is first part of full name
          lastName: name.includes(' ') ? name.split(' ').slice(1).join(' ') : '', // Rest is last name
          email: email,
          phoneNumber: telephone,
          address: address
        });
        
        if (response.data.success) {
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          
          // Close modal and refresh page or redirect
          onClose();
          window.location.reload();
        }
      } else if (userType === "supplier") {
        if (!name || !age) {
          setError("Please fill in all required fields");
          setIsLoading(false);
          return;
        }
        
        // Make API call to register supplier
        const response = await axios.post("http://localhost:5000/api/users/register-supplier", {
          username: email,
          password: password,
          business_name: name,
          email: email,
          phoneNumber: "",
          address: ""
        });
        
        if (response.data.success) {
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          
          // Close modal and refresh page or redirect
          onClose();
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="register-container">
          <div className="register-box">
            <div className="register-left">
              <h2>Create Now</h2>
              <ul>
                <li>✔ Over 700 categories</li>
                <li>✔ Organic And Fresh</li>
                <li>✔ Over 1400 Supplier</li>
              </ul>
            </div>
            <div className="register-right">
              {step === 1 ? (
                <>
                  {!showEmailPassword ? (
                    <>
                      <h2>Create a new account</h2>
                      <p>
                        Already have an account?{" "}
                        <a href="#" onClick={onSwitchToLogin}>
                          Sign in here
                        </a>
                      </p>
                      <button className="google-btn" onClick={() => handleContinueClick("customer")}>
                        Continue with Customer
                      </button>
                      <button className="email-btn" onClick={() => handleContinueClick("supplier")}>
                        Continue with Supplier
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>Create a new account</h2>
                      <p>
                        Already have an account?{" "}
                        <a href="#" onClick={onSwitchToLogin}>
                          Sign in here
                        </a>
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
                      <button onClick={handleBackClick} className="back-btn">
                        Back
                      </button>
                    </>
                  )}
                </>
              ) : step === 2 ? (
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
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <button onClick={handleResendOtp} className="resend-btn">
                    Resend OTP
                  </button>
                  <button onClick={handleBackClick} className="back-btn">
                    Back
                  </button>
                </>
              ) : (
                <>
                  {userType === "customer" ? (
                    <>
                      <h2>Register as Customer</h2>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Enter your telephone"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input-field"
                      />
                      <button onClick={handleRegister} className="continue-btn">
                        Register
                      </button>
                      <button onClick={handleBackClick} className="back-btn">
                        Back
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>Register as Supplier</h2>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="input-field"
                      />
                      <button onClick={handleRegister} className="continue-btn">
                        Register
                      </button>
                      <button onClick={handleBackClick} className="back-btn">
                        Back
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <img src={loadingImage} alt="Loading..." />
        </div>
      )}
    </div>
  );
};

export default Register;