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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '50px',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: '30px',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '20px',
          dots: false,
        }
      },
    ],
  };

  return (
    <section className="cfb-reviews-section">
      <div className="cfb-container">
        <div className="cfb-section-header">
          <h2 className="cfb-section-title">
            <span className="cfb-primary-text">Customer</span> <span className="cfb-accent-text">Reviews</span>
          </h2>
          <p className="cfb-section-subtitle">What our customers say about us</p>
        </div>
        
        <div className="cfb-slider-wrapper">
          <Slider
            {...settings}
            className="cfb-reviews-container"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            onTouchStart={() => setAutoPlay(false)}
            onTouchEnd={() => setAutoPlay(true)}
          >
            {reviews.map((review) => (
              <div className="cfb-review-card" key={review.id}>
                <div className="cfb-review-card-inner">
                  <div className="cfb-review-header">
                    <div className="cfb-customer-info">
                      <div className="cfb-avatar-wrapper">
                        <img className="cfb-review-img"
                          src={`${CUSTOMER_IMAGES}/${review.image}`}
                          alt={review.name}
                        />
                      </div>
                      <div className="cfb-customer-details">
                        <h3 className="cfb-review-name">{review.name}</h3>
                        <p className="cfb-review-title">{review.title}</p>
                      </div>
                    </div>
                    <div className="cfb-review-rating">{"⭐".repeat(review.rating)}</div>
                  </div>
                  <div className="cfb-review-content">
                    <p className="cfb-review-text">{review.comment}</p>
                  </div>
                  <div className="cfb-review-footer">
                    <p className="cfb-review-date">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;