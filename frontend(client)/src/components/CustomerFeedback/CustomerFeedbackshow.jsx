import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import ReviewPopup from "./CustomerFeedbackAdd.jsx";
import "./CustomerFeedbackshow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomerReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch combined feedback and user details from the backend
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedback");
        if (response.data.success) {
          setReviews(response.data.feedback);
        } else {
          console.error("Failed to fetch feedback:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="customer-reviews-section">
      <h2>
        Customer <span>Reviews</span>
      </h2>
      <Slider
        {...settings}
        className="reviews-container"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
        onTouchStart={() => setAutoPlay(false)}
        onTouchEnd={() => setAutoPlay(true)}
      >
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <img
              src={review.image}
              alt={review.name}
              className="review-img"
            />
            <h3 className="review-name">{review.name}</h3>
            <p className="review-text">{review.text}</p>
            <div className="review-rating">{"⭐".repeat(review.rating)}</div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CustomerReviewsSection;