import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ProductDetailPage.css';
import { DEFAULT_IMAGE, PRODUCT_IMAGES } from '../../context/constants';
import { CartContext } from '../../context/CartContext';
import FeedbackPopup from '../../components/ProductReview/ProductReview';
import { CUSTOMER_IMAGES } from "../../context/constants.js";
import { useNotification } from '../../context/notificationContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart} = useContext(CartContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const { showNotification } = useNotification();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingReview(null);
  }

  const handleReviewAdded = async () => {
    fetch(`http://localhost:5000/api/reviews?productId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((error) => console.error('Error fetching reviews:', error));
  };

  const [editingReview, setEditingReview] = useState(null);

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    if (!product) {
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error('Error fetching product:', error));
    }

    fetch(`http://localhost:5000/api/reviews?productId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [id, product]);

  const handleDeleteReview = async (reviewId) => {
    const userId = localStorage.getItem('userId');
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reviewId, userId }),
        });

        const data = await response.json();
        if (data.success) {
          setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
          showNotification('Review deleted successfully.', 'success');
        } else {
          alert(data.message || 'Failed to delete review.');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('An error occurred while deleting the review.');
      }
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const product1 = {
    name: product.name,
    category: "Shop",
    price: product.price,
    originalPrice: 199.99,
    rating: 4.2,
    reviewCount: 128,
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est illum dolor nostrum quas voluptates, consequuntur repudiandae laborum pariatur dolores accusantium magnam, commodi corrupti hic! Officiis eaque cum nihil officia amet.",
    features: [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Bluetooth 5.0",
      "Memory foam ear cushions",
      "Voice assistant compatible",
      "Quick charge (10 mins for 5 hours)",
    ],
    image: `${PRODUCT_IMAGES}/${product.imageUrl}`,
    inStock: product.stock > 0,
    shipping: "Free shipping",
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    return (product1.price * quantity).toFixed(2);
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (review?.rating || 0), 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: id,
      name: product1.name,
      price: product1.price,
      imageUrl: product.imageUrl,
      quantity,
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="product-details-star product-details-full">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="product-details-star product-details-half">★</span>);
      } else {
        stars.push(<span key={i} className="product-details-star product-details-empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-details-detail-container">
      <div className="product-details-section">
        <div className="product-details-images">
          <div className="product-details-main-image">
            <img src={product1.image} alt={product1.name} />
          </div>
        </div>
        <div className="product-details-details">
          <div className="product-details-breadcrumbs">
            Home / {product1.category} / {product1.name}
          </div>

          <div className="product-details-category">{product1.category}</div>
          <h1 className="product-details-name">{product1.name}</h1>

          <div className="product-details-rating">
            <div className="product-details-stars">{renderStars(calculateAverageRating())}</div>
            <div className="product-details-review-count">
              {calculateAverageRating()} ({reviews.length} reviews)
            </div>
          </div>

          <div className="product-details-price">
            <div className="product-details-current-price">${calculateTotalPrice()}</div>
            {product1.originalPrice && (
              <>
                <div className="product-details-original-price">${product1.originalPrice.toFixed(2)}</div>
                <div className="product-details-discount">
                  {Math.round((1 - product1.price / product1.originalPrice) * 100)}% OFF
                </div>
              </>
            )}
          </div>

          <div className="product-details-description">
            {product1.description}
          </div>

          <div className="product-details-actions">
            <div className="product-details-quantity-selector">
              <button className="product-details-quantity-btn" onClick={decreaseQuantity} disabled={quantity === 1}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="product-details-quantity">{quantity}</span>
              <button className="product-details-quantity-btn" onClick={increaseQuantity}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <button className="product-details-add-to-cart-btn" onClick={handleAddToCart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </button>

            <button className="product-details-wishlist-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div className="product-details-meta">
            <div className="product-details-meta-item">
              <span className="product-details-meta-label">Availability:</span>
              <span
                className={`product-details-meta-value product-details-availability ${product1.inStock ? 'in-stock' : 'out-of-stock'
                  }`}
              >
                {product1.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="product-details-meta-item">
              <span className="product-details-meta-label">Shipping:</span>
              <span className="product-details-meta-value">{product1.shipping}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="product-details-tabs">
        <div className="product-details-tab-headers">
          <button
            className={`product-details-tab-btn ${activeTab === 'description' ? 'product-details-active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`product-details-tab-btn ${activeTab === 'features' ? 'product-details-active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button
            className={`product-details-tab-btn ${activeTab === 'reviews' ? 'product-details-active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="product-details-tab-content">
          {activeTab === 'description' && (
            <div className="product-details-tab-description">
              <p>{product1.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="product-details-tab-features">
              <ul className="product-details-feature-list">
                {product1.features.map((feature, index) => (
                  <li key={index} className="product-details-feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="product-details-tab-reviews">
              <div className="product-details-review-summary">
                <div className="product-details-review-average">
                  <h3>Customer Reviews</h3>
                  <div className="product-details-average-rating">
                    <div className="product-details-rating-circle">
                      <span>{calculateAverageRating()}</span>
                      <small>/5</small>
                    </div>
                    <div>
                      <div className="product-details-stars product-details-big-stars">{renderStars(calculateAverageRating())}</div>
                      <p>Based on <strong>{reviews.length}</strong> reviews</p>
                    </div>
                  </div>
                </div>

                <button className="product-details-write-review-btn" onClick={openPopup}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Write a Review
                </button>
              </div>

              <div className="product-details-review-list">
                {reviews.length === 0 ? (
                  <div className="product-details-no-reviews">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="product-details-review-card">
                      <div className="product-details-review-header">
                        <div className="product-details-reviewer-info">
                          <img src={review.image == null ? DEFAULT_IMAGE : `${CUSTOMER_IMAGES}/${review.image}`} className="product-details-reviewer-avatar" alt={review.first_name} />
                          <div>
                            <h4 className="product-details-reviewer-name">{review.first_name}</h4>
                            <div className="product-details-stars">{renderStars(review.rating)}</div>
                          </div>
                        </div>
                        <div className="product-details-review-date-badge">
                          <span>{review.date}</span>
                        </div>
                      </div>

                      <div className="product-details-review-content">
                        {review.title && <h5 className="product-details-review-title">{review.title}</h5>}
                        <p className="product-details-review-comment">{review.comment}</p>
                      </div>

                      {String(localStorage.getItem('userId')) === String(review.userId) && (
                        <div className="product-details-review-actions">
                          <button
                            className="product-details-edit-review-btn"
                            onClick={() => handleEditReview(review)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button
                            className="product-details-delete-review-btn"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {isPopupOpen && <FeedbackPopup onClose={closePopup} productId={id}
        onReviewAdded={handleReviewAdded} review={editingReview}/>}
    </div>
  );
};

export default ProductDetailPage;