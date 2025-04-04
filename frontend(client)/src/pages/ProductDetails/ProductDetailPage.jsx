import React, { useState } from 'react';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Updated product data with single image
  const product = {
    name: "Ultra Comfort Wireless Headphones",
    category: "Headphones",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.2,
    reviewCount: 128,
    description: "Experience the ultimate in audio comfort with our Ultra Comfort Wireless Headphones. Featuring premium noise cancellation, 40-hour battery life, and memory foam ear cushions for extended wear.",
    features: [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Bluetooth 5.0",
      "Memory foam ear cushions",
      "Voice assistant compatible",
      "Quick charge (10 mins for 5 hours)",
    ],
    image: "https://placehold.co/600x600", // Changed from images array to single image
    inStock: true,
    shipping: "Free shipping",
    sku: "HP-001-BLK"
  };

  // Sample reviews
  const reviews = [
    {
      id: 1,
      user: "Alex Johnson",
      date: "March 15, 2025",
      rating: 5,
      title: "Best headphones I've ever owned",
      comment: "These headphones are incredible. The sound quality is outstanding, and the comfort is unmatched. I can wear them all day without any discomfort. The noise cancellation works perfectly in noisy environments.",
      avatar: "https://placehold.co/50x50"
    },
    {
      id: 2,
      user: "Sarah Miller",
      date: "March 10, 2025",
      rating: 4,
      title: "Great sound but battery could be better",
      comment: "The sound quality is amazing and they're very comfortable. My only complaint is that the battery doesn't quite last the full 40 hours as advertised. I get about 35 hours which is still pretty good.",
      avatar: "https://placehold.co/50x50"
    },
    {
      id: 3,
      user: "David Chen",
      date: "February 28, 2025",
      rating: 4,
      title: "Premium quality, worth the price",
      comment: "The build quality is excellent and the sound is crisp and clear. The noise cancellation is effective but not quite as good as some competitors. Overall very satisfied with my purchase.",
      avatar: "https://placehold.co/50x50"
    }
  ];

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
      {/* Product Section */}
      <div className="product-details-section">
        {/* Left: Product Image - Updated for single image */}
        <div className="product-details-images">
          <div className="product-details-main-image">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="product-details-details">
          <div className="product-details-breadcrumbs">
            Home / Headphones / {product.name}
          </div>
          
          <div className="product-details-category">{product.category}</div>
          <h1 className="product-details-name">{product.name}</h1>
          
          <div className="product-details-rating">
            <div className="product-details-stars">{renderStars(product.rating)}</div>
            <div className="product-details-review-count">{product.rating} ({product.reviewCount} reviews)</div>
          </div>
          
          <div className="product-details-price">
            <div className="product-details-current-price">${product.price.toFixed(2)}</div>
            {product.originalPrice && (
              <>
                <div className="product-details-original-price">${product.originalPrice.toFixed(2)}</div>
                <div className="product-details-discount">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              </>
            )}
          </div>
          
          <div className="product-details-description">
            {product.description}
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
            
            <button className="product-details-add-to-cart-btn">
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
              <span className="product-details-meta-label">SKU:</span>
              <span className="product-details-meta-value">{product.sku}</span>
            </div>
            <div className="product-details-meta-item">
              <span className="product-details-meta-label">Availability:</span>
              <span className="product-details-meta-value product-details-availability">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="product-details-meta-item">
              <span className="product-details-meta-label">Shipping:</span>
              <span className="product-details-meta-value">{product.shipping}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
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
            Reviews ({product.reviewCount})
          </button>
        </div>
        
        <div className="product-details-tab-content">
          {activeTab === 'description' && (
            <div className="product-details-tab-description">
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          )}
          
          {activeTab === 'features' && (
            <div className="product-details-tab-features">
              <ul className="product-details-feature-list">
                {product.features.map((feature, index) => (
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
                    <span className="product-details-big-rating">{product.rating}</span>
                    <div>
                      <div className="product-details-stars product-details-big-stars">{renderStars(product.rating)}</div>
                      <p>Based on {product.reviewCount} reviews</p>
                    </div>
                  </div>
                </div>
                
                <button className="product-details-write-review-btn">Write a Review</button>
              </div>

              <div className="product-details-review-list">
                {reviews.map(review => (
                  <div key={review.id} className="product-details-review-item">
                    <div className="product-details-review-header">
                      <div className="product-details-reviewer-info">
                        <img src={review.avatar} alt={review.user} className="product-details-reviewer-avatar" />
                        <div>
                          <h4 className="product-details-reviewer-name">{review.user}</h4>
                          <div className="product-details-review-date">{review.date}</div>
                        </div>
                      </div>
                      <div className="product-details-review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <h5 className="product-details-review-title">{review.title}</h5>
                    <p className="product-details-review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;