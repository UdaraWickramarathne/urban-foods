import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import storeContext from "../../context/storeContext";

const LoginPage = ({ onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {setToken,setUserId,setRole} = storeContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const { token, userId, role } = response.data;
        setToken(token);
        console.log("Login successful:", { userId, role });
        setUserId(userId);
        setRole(role);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
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
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" className="continue-btn">
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;