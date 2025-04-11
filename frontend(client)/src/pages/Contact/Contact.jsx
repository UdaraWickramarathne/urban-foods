import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission to a backend
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset the submitted state after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you! Reach out with any questions, feedback, or catering inquiries.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <p>Thank you for your message! We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={5}
                />
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          )}
        </div>

        <div className="contact-info-container">
          <div className="contact-info">
            <div className="info-item">
              <FiMapPin className="info-icon" />
              <div>
                <h3>Our Location</h3>
                <p>123 Food Street, Urban City, 10001</p>
              </div>
            </div>
            <div className="info-item">
              <FiPhone className="info-icon" />
              <div>
                <h3>Phone Number</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-item">
              <FiMail className="info-icon" />
              <div>
                <h3>Email Address</h3>
                <p>contact@urbanfood.com</p>
              </div>
            </div>
            <div className="info-item">
              <FiClock className="info-icon" />
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Friday: 9am - 10pm</p>
                <p>Weekends: 10am - 11pm</p>
              </div>
            </div>
          </div>
          
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215173144621!2d-73.9878584!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0x999668d0d7c3fd7d!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1648482801394!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Urban Food Location"
            ></iframe>
          </div>

          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
