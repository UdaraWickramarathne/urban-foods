import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaStar, FaProductHunt, FaTags, FaCommentDots, FaBlog } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-section">
          <img src="src/images/product-1.png" alt="UrbanFoods Logo" className="footer-logo" />
          <h2>UrbanFoods</h2>
          <h3>hdjhbdfshfsjs</h3>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li><FaPhone /> 078565524</li>
            <li><FaPhone /> 07554545</li>
            <li><FaEnvelope /> Exemple@Gmail.Com</li>
            <li><FaMapMarkerAlt /> Matara</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><FaHome /> Home</li>
            <li><FaStar /> Features</li>
            <li><FaProductHunt /> Products</li>
            <li><FaCommentDots /> Review</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Newsletter</h3>
          <div className="newsletter-box">
            <p>Subscribe For Latest Updates</p>
            <div className="email-input">
              <input type="email" placeholder="Your Email" />
              <button>Subscribe</button>
            </div>
            <div className="footer-links">
              <a href="/"><FaFacebook />Facebook</a>
              <a href="/"><FaTwitter />Twitter</a>
              <a href="/"><FaInstagram />Instagram</a>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>DenNEt | All Right Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;