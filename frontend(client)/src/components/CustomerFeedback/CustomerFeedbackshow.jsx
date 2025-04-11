import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "./CustomerFeedbackshow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CUSTOMER_IMAGES } from "../../context/constants.js";

const CustomerReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedback");
        console.log("Feedback data:", response.data);
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
            <img className="review-img"
              src={`${CUSTOMER_IMAGES}/${review.image}`}
              alt={review.name}
            />
            <h3 className="review-name">{review.name}</h3>
            <p className="review-title">{review.title}</p>
            <p className="review-text">{review.comment}</p>
            <div className="review-rating">{"⭐".repeat(review.rating)}</div>
            <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CustomerReviewsSection;