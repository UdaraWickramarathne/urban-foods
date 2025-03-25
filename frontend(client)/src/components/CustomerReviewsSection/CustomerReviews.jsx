import React, { useState } from "react";
import Slider from "react-slick";
import ReviewPopup from "../../components/CustomerFeedback/CustomerFeedback.jsx";
import "./CustomerReviews.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomerReviewsSection = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "John Doe",
      text: "Great service and fresh products!",
      image: "src/images/product-1.png",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      text: "I love the variety of products available.",
      image: "src/images/product-1.png",
      rating: 4,
    },
    {
      id: 3,
      name: "Sam Wilson",
      text: "Fast delivery and excellent quality.",
      image: "src/images/product-1.png",
      rating: 5,
    },
    {
      id: 4,
      name: "Anna Johnson",
      text: "Highly recommend this store!",
      image: "src/images/product-1.png",
      rating: 5,
    },
    {
      id: 5,
      name: "Peter Brown",
      text: "Great prices and friendly staff.",
      image: "src/images/product-1.png",
      rating: 4,
    },
  ]);

  const [autoPlay, setAutoPlay] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  const handlePopupOpen = () => {
    setAutoPlay(false);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setAutoPlay(true); // Resume autoplay when popup closes
    setIsPopupOpen(false);
  };

  const handleReviewSubmit = (review) => {
    // Add the new review to the reviews array
    setReviews((prevReviews) => [
      ...prevReviews,
      {
        ...review,
        name: review.reviewer, // Map 'reviewer' to 'name'
        id: prevReviews.length + 1,
        image: "src/images/product-1.png",
      },
    ]);
  };

  return (
    <section className="customer-reviews-section">
      <h2>
        Customer <span>Reviews</span>
      </h2>
      <button onClick={handlePopupOpen} className="add-review-btn">
        Add Review
      </button>
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
      <ReviewPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onSubmit={handleReviewSubmit} // Pass the onSubmit handler
      />
    </section>
  );
};

export default CustomerReviewsSection;