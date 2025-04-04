import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import TrueFocus from "../TrueFocus/TrueFocus";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import storeContext from "../../context/storeContext";

const Navbar = ({ onUserIconClick }) => {
  const [menu, setMenu] = useState("home");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cartDropdownVisible, setCartDropdownVisible] = useState(false);
  const { token, setToken, setRole, setUserId, role } = storeContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleUserIconClick = () => {
    setDropdownVisible(!dropdownVisible);
    if (cartDropdownVisible) setCartDropdownVisible(false);
  };

  const handleCartIconClick = (e) => {
    e.preventDefault();
    setCartDropdownVisible(!cartDropdownVisible);
    if (dropdownVisible) setDropdownVisible(false);
  };

  const handleLogout = () => {
    setToken("");
    setUserId("");
    setRole("");
    navigate("/");
    setDropdownVisible(!dropdownVisible);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
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
            borderColor="white"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>
        
        {/* Navigation Links */}
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

        {/* Search, User and Cart Icons */}
        <div className="navbar-icons">

          {token ? (
            <div className="user-icon-container">
              <div className="icon-user" onClick={handleUserIconClick}>
                <PersonOutlineIcon />
                <span className="icon-label">Account</span>
              </div>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">My Account</div>
                  <Link to="/profile" className="dropdown-item" onClick={handleProfileClick}>
                    <span className="dropdown-icon">👤</span> Profile
                  </Link>
                  {role === "supplier" && (
                    <Link to="/dashboard" className="dropdown-item">
                      <span className="dropdown-icon">📊</span> Dashboard
                    </Link>
                  )}
                  <Link to="/orders" className="dropdown-item">
                    <span className="dropdown-icon">📦</span> My Orders
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={onUserIconClick}
              sx={{
                backgroundColor: "white",
                color: "#16a34a",
                borderRadius: "25px",
                padding: "8px 20px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 2px 10px rgba(76, 175, 80, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f0f1f2",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                  transform: "translateY(-2px)"
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 5px rgba(76, 175, 80, 0.2)"
                }
              }}
              variant="contained"
              startIcon={<LoginIcon style={{ fontSize: 18 }} />}
            >
              Login
            </Button>
          )}

          <div className="cart-icon-container">
            <button className="cart-button" onClick={handleCartIconClick}>
              <div className="cart-button-content">
                <ShoppingBagOutlinedIcon />
                <span className="cart-count">2</span>
                <span className="icon-label">Cart</span>
              </div>
            </button>
            {cartDropdownVisible && (
              <div className="cart-dropdown">
                <div className="cart-dropdown-header">
                  <h3>Shopping Cart <span className="cart-count-badge">2</span></h3>
                  <button className="close-cart-btn" onClick={handleCartIconClick}>×</button>
                </div>
                
                <div className="cart-items-wrapper">
                  {true ? (
                    <>
                      <div className="cart-item-list">
                        <div className="cart-item">
                          <div className="cart-item-img">
                            <img src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Organic Apples" />
                          </div>
                          <div className="cart-item-content">
                            <div className="cart-item-top">
                              <h4 className="cart-item-title">Organic Apples</h4>
                              <button className="remove-item-btn" title="Remove item">×</button>
                            </div>
                            <div className="cart-item-bottom">
                              <div className="quantity-selector">
                                <button className="qty-btn dec">-</button>
                                <span className="qty-value">1</span>
                                <button className="qty-btn inc">+</button>
                              </div>
                              <div className="cart-item-price">$4.99</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="cart-item">
                          <div className="cart-item-img">
                            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Fresh Bread" />
                          </div>
                          <div className="cart-item-content">
                            <div className="cart-item-top">
                              <h4 className="cart-item-title">Fresh Bread</h4>
                              <button className="remove-item-btn" title="Remove item">×</button>
                            </div>
                            <div className="cart-item-bottom">
                              <div className="quantity-selector">
                                <button className="qty-btn dec">-</button>
                                <span className="qty-value">1</span>
                                <button className="qty-btn inc">+</button>
                              </div>
                              <div className="cart-item-price">$3.49</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cart-summary">
                        <div className="cart-summary-row">
                          <span>Subtotal</span>
                          <span>$8.48</span>
                        </div>
                        <div className="cart-summary-row">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="cart-summary-total">
                          <span>Total</span>
                          <span>$8.48</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-cart-state">
                      <div className="empty-cart-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zm-9-1a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                        </svg>
                      </div>
                      <h3>Your cart is empty</h3>
                      <p>Looks like you haven't added any items yet</p>
                      <Link to="/shop" className="start-shopping-btn" onClick={handleCartIconClick}>
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
                
                {true && (
                  <div className="cart-actions">
                    <Link to="/cart" className="view-cart-btn" onClick={handleCartIconClick}>
                      View Cart
                    </Link>
                    <Link to="/checkout" className="checkout-btn" onClick={handleCartIconClick}>
                      Checkout
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;