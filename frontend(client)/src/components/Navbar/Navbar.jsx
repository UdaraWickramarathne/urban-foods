import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import TrueFocus from "../TrueFocus/TrueFocus";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import storeContext from "../../context/storeContext";

const Navbar = ({ onUserIconClick }) => {
  const [menu, setMenu] = useState("home");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { token, setToken, setUserId, role } = storeContext();
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleUserIconClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    setToken("");
    setUserId("");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <TrueFocus
            sentence="Urban Foods"
            manualMode={false}
            blurAmount={5}
            borderColor="green"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>
        <div className="navbar-links">
          <ul>
            <Link
              to="/"
              className={menu === "home" ? "active" : ""}
              onClick={() => setMenu("home")}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={menu === "shop" ? "active" : ""}
              onClick={() => setMenu("shop")}
            >
              Shop
            </Link>
            <Link
              to="/sale"
              className={menu === "sale" ? "active" : ""}
              onClick={() => setMenu("sale")}
            >
              Sale
            </Link>
            <Link
              to="/about"
              className={menu === "about" ? "active" : ""}
              onClick={() => setMenu("about")}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={menu === "contact" ? "active" : ""}
              onClick={() => setMenu("contact")}
            >
              Contact
            </Link>
          </ul>
        </div>

        {/* User and Cart Icons */}
        <div className="navbar-icons">
          {token ? (
            <div className="user-icon-container">
              <div className="icon-user" onClick={handleUserIconClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
              </div>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={handleProfileClick}>
                    Profile
                  </Link>
                  {role === "supplier" && (
                    <Link to="/dashboard" className="dropdown-item">
                      Dashboard
                    </Link>
                  )}
                  <button className="dropdown-item1" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={onUserIconClick}
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "20px",
              }}
              variant="contained"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}

          <a href="/Cart" className="icon-cart">
            <div className="cart-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-count">2</span>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;