import React, { useState } from "react";
import Slider from "react-slick";
import "./CustomerReviews.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
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
];

const CustomerReviewsSection = () => {
  const [autoPlay, setAutoPlay] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
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