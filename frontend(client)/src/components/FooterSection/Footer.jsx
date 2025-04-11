import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaStar, FaProductHunt, FaCommentDots, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="ft-footer-container">
      
      <div className="ft-footer-content">
        <div className="ft-footer-logo-section">
          <img src="src/images/product-1.png" alt="UrbanFoods Logo" className="ft-footer-logo" />
          <h2>UrbanFoods</h2>
          <p className="ft-tagline">Fresh, Delicious, Delivered</p>
          <div className="ft-social-icons">
            <a href="/" className="ft-social-icon"><FaFacebook /></a>
            <a href="/" className="ft-social-icon"><FaTwitter /></a>
            <a href="/" className="ft-social-icon"><FaInstagram /></a>
          </div>
        </div>
        
        <div className="ft-footer-section">
          <h3>Contact Us</h3>
          <ul className="ft-contact-list">
            <li><FaPhone /> <span>+94 78 565 5524</span></li>
            <li><FaPhone /> <span>+94 75 545 4545</span></li>
            <li><FaEnvelope /> <span>contact@urbanfoods.com</span></li>
            <li><FaMapMarkerAlt /> <span>Matara, Sri Lanka</span></li>
          </ul>
        </div>
        
        <div className="ft-footer-section">
          <h3>Quick Links</h3>
          <ul className="ft-quick-links">
            <li><a href="/"><FaHome /> <span>Home</span></a></li>
            <li><a href="/features"><FaStar /> <span>Features</span></a></li>
            <li><a href="/products"><FaProductHunt /> <span>Products</span></a></li>
            <li><a href="/reviews"><FaCommentDots /> <span>Reviews</span></a></li>
          </ul>
        </div>
        
        <div className="ft-footer-section ft-newsletter-section">
          <h3>Newsletter</h3>
          <div className="ft-newsletter-box">
            <p>Subscribe for exclusive offers and updates</p>
            <div className="ft-email-input">
              <input type="email" placeholder="Your Email Address" />
              <button className="ft-subscribe-btn"><FaArrowRight /></button>
            </div>
            <p className="ft-newsletter-info">We'll never share your email with anyone else.</p>
          </div>
        </div>
      </div>
      
      <div className="ft-copyright">
        <p>&copy; {new Date().getFullYear()} UrbanFoods | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;