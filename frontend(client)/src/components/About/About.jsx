import React from "react";
import "./About.css";
import { motion } from "framer-motion";
import Footer from "../FooterSection/Footer";

const App = () => {
  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="hero">
        <h1>About Us</h1>
        <video autoPlay muted loop className="background-video">
          <source src="src/assets/hero-video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2>Fresh, Fast & Urban – The Future of Food</h2>
          <p>Discover the taste of modern city life with our fresh ingredients and innovative flavors.</p>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <motion.div 
            className="about-image"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img src="./src/assets/grocery.jpg" alt="Grocery Shopping" />
          </motion.div>
          <div className="about-text">
            <h2>Welcome To Grocery Shop - An ECommerce Platform</h2>
            <p>At Urban Food, we believe that great food is at the heart of every vibrant city. Our mission is to bring fresh, flavorful, and innovative culinary experiences to urban food lovers. Whether you're craving gourmet street eats, healthy meal options, or indulgent comfort food, we’ve got something to satisfy every palate.</p>
            <p>With a passion for quality ingredients and bold flavors, we curate a menu that celebrates both local and global cuisines. Our chefs blend creativity with tradition, ensuring every bite is an unforgettable experience.</p>
            <motion.button className="shop-now" whileHover={{ scale: 1.1 }}>
              Shop Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>Subscribe To Our Newsletter</h3>
            <p>Get E-Mail Updates About Our Latest Shops And Special Offers</p>
          </div>
          <div className="newsletter-form">
            <input type="email" id="email" placeholder="Enter Email Address" />
            <motion.button id="subscribe-btn" onClick={handleSubscribe} whileHover={{ scale: 1.1 }}>
              Subscribe
            </motion.button>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="contact-section">
        <h1>Contact Us</h1>
        <div className="contact-details">
          <div className="contact-item">
            <h4>Address</h4>
            <p>123 Main Street, Anytown, USA</p>
          </div>
          <div className="contact-item">
            <h4>Phone</h4>
            <p>(123) 456-7890</p>
          </div>
          <div className="contact-item">
            <h4>Email</h4>
            <p>info@groceryshop.com</p>
          </div>
          <div className="contact-item">
            <h4>Website</h4>
            <p>
              <a 
                href="https://www.groceryshop.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                www.groceryshop.com
              </a>
            </p>
          </div>
        </div>
        <div className="contact-content">
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63492.95583422852!2d80.50954816285373!3d5.951990672261148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae138d151937cd9%3A0x1d711f45897009a3!2sMatara!5e0!3m2!1sen!2slk!4v1718646449221!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: "0", borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="contact-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Message"></textarea>
            <motion.button className="send-btn" whileHover={{ scale: 1.1 }}>
              Send Message
            </motion.button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const handleSubscribe = () => {
  let email = document.getElementById("email").value;
  if (email === "") {
    alert("Please enter a valid email address!");
  } else {
    alert("Thank you for subscribing!");
    document.getElementById("email").value = "";
  }
};

export default App;