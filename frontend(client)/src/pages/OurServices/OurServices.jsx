import React from 'react';
import './OurServices.css';
import { FaShippingFast, FaLock, FaExchangeAlt, FaHeadset, 
         FaGlobeAmericas, FaGift, FaBox, FaEnvelope } from 'react-icons/fa';

const OurServices = () => {
  const services = [
    {
      icon: <FaShippingFast />,
      title: "Fast & Free Shipping",
      description: "Enjoy quick delivery on all orders with our reliable shipping partners."
    },
    {
      icon: <FaLock />,
      title: "Secure Payments",
      description: "Shop with confidence using our encrypted and protected payment gateways."
    },
    {
      icon: <FaExchangeAlt />,
      title: "Easy Returns",
      description: "Not satisfied? Return within 30 days for a full refund, no questions asked."
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Customer Support",
      description: "Our friendly team is always available to assist you with any questions."
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Worldwide Delivery",
      description: "We ship to over 190 countries, bringing our products to your doorstep."
    },
    {
      icon: <FaGift />,
      title: "Gift Wrapping",
      description: "Make your gifts special with our premium wrapping service."
    },
    {
      icon: <FaBox />,
      title: "Order Tracking",
      description: "Track your package at every step until it reaches you."
    },
    {
      icon: <FaEnvelope />,
      title: "Email & SMS Updates",
      description: "Stay informed with real-time notifications about your order status."
    }
  ];

  const stats = [
    { number: "1M+", text: "Happy Customers" },
    { number: "99%", text: "Satisfaction Rate" },
    { number: "150+", text: "Trusted Brands" },
    { number: "100%", text: "Eco-friendly Packaging" }
  ];

  return (
    <div className="os-our-services">
      {/* Hero Section */}
      <section className="os-hero-section">
        <div className="os-container">
          <h1>What We Offer to Power Your Shopping Experience</h1>
          <p>Reliable, seamless, and satisfying — our services are designed with you in mind.</p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="os-services-grid">
        <div className="os-container">
          <h2>Our Services</h2>
          <div className="os-services-container">
            {services.map((service, index) => (
              <div className="os-service-card" key={index}>
                <div className="os-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="os-why-choose-us">
        <div className="os-container">
          <h2>Why Choose Us</h2>
          <div className="os-stats-container">
            {stats.map((stat, index) => (
              <div className="os-stat-card" key={index}>
                <h3>{stat.number}</h3>
                <p>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurServices;
