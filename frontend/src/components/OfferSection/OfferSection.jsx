import React, { useEffect, useState } from "react";
import "./OfferSection.css";

const OfferSection = () => {
  const calculateTimeLeft = () => {
    const difference = new Date("2025-03-31T23:59:59") - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="deal-container">
      <div className="image-container">
        <img
          src=""
          
        />
      </div>
      <div className="deal-info">
        <p className="best-price">Best Price For You</p>
        <h1 className="deal-title">Deal Of The Day</h1>
        <p className="deal-description">
          Far Far Away, Behind The Word Mountains, Far From The Countries
          Vokalia And Consonantia
        </p>
        <p className="product-name">Spinach</p>
        <p className="price">
          <span className="old-price">$10</span>
          <span className="new-price">Now $5 Only</span>
        </p>
        <div className="countdown">
          <div className="time-box">
            <span className="time-value">{timeLeft.days}</span>
            <p className="time-label">DAYS</p>
          </div>
          <div className="time-box">
            <span className="time-value">{timeLeft.hours}</span>
            <p className="time-label">HOURS</p>
          </div>
          <div className="time-box">
            <span className="time-value">{timeLeft.minutes}</span>
            <p className="time-label">MINUTES</p>
          </div>
          <div className="time-box">
            <span className="time-value">{timeLeft.seconds}</span>
            <p className="time-label">SECONDS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;