import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './ProductDtails.css';

const ProductDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const product = state?.product;

  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState(product?.reviews || []);

  if (!product) {
    return <p>Product not found!</p>;
  }

  const handleIncreaseQuantity = () => setQuantity(quantity + 1);
  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const newReview = {
        reviewer: 'Anonymous',
        date: new Date().toLocaleDateString(),
        rating: 5,
        text: reviewText,
      };
      setReviews([...reviews, newReview]);
      setReviewText('');
    }
  };

  return (
    <div className="productd-container">
      <div className="productd-details">
        <div className="productd-image">
          <img src="/tomato.png"  />
        </div>
        <div className="productd-info">
          <h1 className="productd-title">{product.name}</h1>
          <div className="productd-rating">
            <span>⭐⭐⭐⭐⭐</span>
            <span>{reviews.length} reviews</span>
          </div>
          <p className="productd-price">{product.price}</p>
          <div className="productd-quantity">
            <label>Quantity</label>
            <div className="quantityd-controls">
              <button onClick={handleDecreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncreaseQuantity}>+</button>
            </div>
          </div>
          <div className="productd-actions">
            <button className="add-to-cart">Add to cart</button>
          </div>
          <p className="productd-description">{product.description}</p>
          <div className="productd-tabs">
            <button>Ingredients</button>
            <button>Benefits</button>
          </div>
        </div>
      </div>
      <div className="reviews-section">
        <div className="review-summary">
          <span className="rating-score">{product.rating}</span>
          <span>Based on {reviews.length} reviews</span>
        </div>
        <div className="write-review">
          <form onSubmit={handleReviewSubmit}>
            <textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div className="review" key={index}>
              <div className="review-header">
                <span>{review.reviewer}</span>
                <span>{review.date}</span>
                <span>{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;