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
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [bname, setbName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
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
    try {
      const endpoint =
        userType === "customer"
          ? "http://localhost:5000/api/users/customer"
          : "http://localhost:5000/api/users/supplier";
  
      const payload =
        userType === "customer"
          ? { 
              firstName: fname, 
              lastName: lname, 
              username : username, 
              address : address, 
              email : email, 
              password :password, 
              imageUrl: null 
            }
          : { 
              business_name: bname, 
              address: address, 
              email:email, 
              password:password, 
              imageUrl: null 
            };
  
      console.log("Payload being sent:", payload);
  
      const response = await axios.post(endpoint, payload);
  
      if (response.status === 201) {
        alert("Registration Successful!");
        onClose();
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
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
                        placeholder="Enter your first name"
                        value={fname}
                        onChange={(e) => setfName(e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        value={lname}
                        onChange={(e) => setlName(e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Enter your User Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={bname}
                        onChange={(e) => setbName(e.target.value)}
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