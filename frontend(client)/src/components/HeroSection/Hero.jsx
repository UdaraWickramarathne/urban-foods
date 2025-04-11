import React, { useState, useEffect } from "react";
import "./Hero.css";
import milkImg from "../../assets/milk.png";
import vegetablesImg from "../../assets/vegetables.png";
import eggImg from "../../assets/egg.png";
import breadImg from "../../assets/bread.png";
import tomato from "../../assets/tomato.png";
import fruits from "../../assets/fruits.png";
import TrueFocus from "../TrueFocus/TrueFocus";
import { FaShoppingCart, FaSearch, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderImages = [
    {
      src: milkImg,
      alt: "Fresh milk bottles",
      circleColor: "#dbeafe", // light blue
    },
    {
      src: breadImg,
      alt: "Artisan bread",
      circleColor: "#fef3c7", // light amber
    },
    {
      src: vegetablesImg,
      alt: "Fresh vegetables",
      circleColor: "#c7fecc", // light red
    },
    {
      src: fruits,
      alt: "Fresh Fruits",
      circleColor: "#f5fec7", // light orange
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <section className="hero-container">
      {/* Promotional banner */}
      <div className="promo-banner">
        <span>🎉 FREE delivery on orders over $50! Limited time offer</span>
      </div>
      
      {/* Left section with text */}
      <div className="hero-text-section">
        <div className="hero-badge">Premium Quality</div>
        <h1 className="hero-title">
          Fresh Local Produce <span className="highlight">Delivered Daily</span>
        </h1>
        <p className="hero-description">
          Connect directly with local farmers and artisans. Experience the
          freshest produce, dairy, and handcrafted goods delivered straight to
          your doorstep.
        </p>
        
        <div className="hero-cta-group">
          <button className="hero-button primary">
            <FaShoppingCart className="button-icon" /> Shop Now
          </button>
          <button className="hero-button secondary">
            Browse Categories <FaArrowRight className="button-icon" />
          </button>
        </div>
        
        <div className="hero-search">
          <input type="text" placeholder="Search for fresh products..." />
          <button className="search-button"><FaSearch /></button>
        </div>
        
        <div className="trust-badges">
          <span>✓ Fresh Guarantee</span>
          <span>✓ Local Sourcing</span>
          <span>✓ Same-Day Delivery</span>
        </div>
      </div>

      {/* Right section with image slider */}
      <div className="hero-image-section">
        <div className="image-slider-container">
          {/* Sale badge */}
          <div className="sale-badge">
            <span>30% OFF</span>
            <span className="small">Selected Items</span>
          </div>
          
          {/* Circle background that changes color */}
          <div
            className="circle-background"
            style={{
              backgroundColor: sliderImages[currentImageIndex].circleColor,
            }}
          ></div>

          {/* Image carousel */}
          <div className="slider-images-container">
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`slider-image ${
                  index === currentImageIndex ? "active" : ""
                }`}
              >
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>

          {/* Slider indicators */}
          <div className="slider-indicators">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`indicator-dot ${
                  index === currentImageIndex ? "active" : ""
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll for more</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;
