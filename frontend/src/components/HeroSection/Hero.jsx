import React, { useState, useEffect } from 'react';
import './Hero.css'; // Make sure to create this CSS file
import milkImg from "../../assets/milk.png";
import vegetablesImg from "../../assets/vegetables.png";
import eggImg from "../../assets/egg.png";
import breadImg from "../../assets/bread.png";
import tomato from "../../assets/tomato.png";
import fruits from "../../assets/fruits.png";
import TrueFocus from '../TrueFocus/TrueFocus';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const sliderImages = [
    {
      src: milkImg,
      alt: "Fresh milk bottles",
      circleColor: "#dbeafe" // light blue
    },
    {
      src: breadImg,
      alt: "Artisan bread",
      circleColor: "#fef3c7" // light amber
    },
    {
      src: vegetablesImg,
      alt: "Fresh vegetables",
      circleColor: "#c7fecc" // light red
    },
    {
      src: fruits,
      alt: "Fresh Fruits",
      circleColor: "#f5fec7" // light orange
    }
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
    <div className="hero-container">
      {/* Left section with text */}
      <div className="hero-text-section">
      <TrueFocus
          sentence="Urban Foods"
          manualMode={false}
          blurAmount={5}
          borderColor="green"
          animationDuration={2}
          pauseBetweenAnimations={1}
        />
        <p className="hero-description">
          Connect directly with local farmers and artisans. Experience the freshest produce, dairy, and handcrafted goods delivered straight to your doorstep.
        </p>
        <button className="hero-button">Explore Products</button>
      </div>
      
      {/* Right section with image slider */}
      <div className="hero-image-section">
        <div className="image-slider-container">
          {/* Circle background that changes color */}
          <div 
            className="circle-background"
            style={{ backgroundColor: sliderImages[currentImageIndex].circleColor }}
          ></div>
          
          {/* Image carousel */}
          <div className="slider-images-container">
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
          
          {/* Slider indicators */}
          <div className="slider-indicators">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;