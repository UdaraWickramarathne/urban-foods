import React, { use, useContext, useEffect, useState } from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_IMAGES } from '../../context/constants';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, updateQuantity, getQuantity, cartItems } = useContext(CartContext);

  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const quantity = getQuantity(product.productId) || 0;
  const isInCart = quantity > 0;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews?productId=${product.productId}`);
        if (response.data.success) {
          const reviews = response.data.reviews;
          setReviewCount(reviews.length);

          const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
          setAverageRating(avgRating);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [product.productId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.floor(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const increaseQuantity = () => {
    updateQuantity(product.productId, quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.productId, quantity - 1);
    } else {
      removeFromCart(product.productId);
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product.productId}`);
  };

  const originalPrice = (product.price * 1.25).toFixed(2);
  const discount = 20;
  const isNew = true;

  return (
    <div className="product-card">
      <div className="product-image" onClick={handleProductClick}>
        <img src={`${PRODUCT_IMAGES}/${product.imageUrl}`} alt={product.name} />
        <div className="wishlist">
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        </div>
        {isNew && <div className="product-tag">NEW</div>}
      </div>
      <div className="product-info">
        <div className="product-category">{product.categoryName}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <div className="current-price">${product.price}</div>
          <div className="original-price">${originalPrice}</div>
          <div className="discount">-{discount}%</div>
        </div>
        <div className="product-rating">
          <div className="stars">{renderStars(averageRating)}</div>
          <div className="review-count">
            {averageRating} ({reviewCount} reviews)
          </div>
        </div>
        <div className="product-actions">
          {!isInCart ? (
            <button className="add-to-cart" onClick={handleAddToCart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-control">
              <button className="quantity-btn" onClick={decreaseQuantity}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-btn" onClick={increaseQuantity}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;