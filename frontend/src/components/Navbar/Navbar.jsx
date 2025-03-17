import React, { useState } from 'react';
import { ShoppingBag, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  
  const navItems = ['Home', 'Explore', 'Menu', 'Mobile App', 'Contact Us'];
  
  const handleNavClick = (item) => {
    setActiveItem(item);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on left */}
        <div className="navbar-logo">
          <span className="typing-animation">Urban Foods.</span>
        </div>
        
        {/* Navigation links in middle */}
        <div className="navbar-links">
          {navItems.map(item => (
            <a 
              key={item}
              href="#" 
              className={activeItem === item ? 'active' : ''}
              onClick={() => handleNavClick(item)}
            >
              {item}
            </a>
          ))}
        </div>
        
        {/* Right side elements */}
        <div className="navbar-actions">
          <button className="cart-button">
            <ShoppingBag size={24} />
          </button>
          <button className="sign-in-button">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;