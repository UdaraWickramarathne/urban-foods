import React, { useState } from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_IMAGES } from '../../context/constants';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const handleAddToCart = async() => {
    setIsInCart(true);
    try {
      const response = await axios.post('http://localhost:5000/api/cart', {
        userId: localStorage.getItem('userId'),
        productId: product.productId,
        quantity: quantity,
      });
      if (response.data.success) {
        setIsInCart(true);
        alert('Product added to cart successfully!');
      } else {
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('An error occurred while adding the product to the cart.');
    }
  };

  const increaseQuantity = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/${product.productId}`, {
        userId: localStorage.getItem('userId'),
        quantity: quantity + 1,
      });
  
      if (response.data.success) {
        setQuantity(quantity + 1);
        alert('Quantity increased successfully!');
      } else {
        alert('Failed to increase quantity.');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      alert('An error occurred while increasing the quantity.');
    }
  };
  
  const decreaseQuantity = async () => {
    if (quantity > 1) {
      try {
        const response = await axios.put(`http://localhost:5000/api/cart/${product.productId}`, {
          userId: localStorage.getItem('userId'),
          quantity: quantity - 1,
        });
  
        if (response.data.success) {
          setQuantity(quantity - 1);
          alert('Quantity decreased successfully!');
        } else {
          alert('Failed to decrease quantity.');
        }
      } catch (error) {
        console.error('Error decreasing quantity:', error);
        alert('An error occurred while decreasing the quantity.');
      }
    } else {
      try {
        const response = await axios.delete(`http://localhost:5000/api/cart/${product.productId}`, {
          data: {
            userId: localStorage.getItem('userId'),
          },
        });
  
        if (response.data.success) {
          setIsInCart(false);
          alert('Product removed from cart successfully!');
        } else {
          alert('Failed to remove product from cart.');
        }
      } catch (error) {
        console.error('Error removing product from cart:', error);
        alert('An error occurred while removing the product from the cart.');
      }
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product.productId}`);
  };

  // Hardcoded values for properties not in the database
  const originalPrice = (product.price * 1.25).toFixed(2);
  const discount = 20;
  const rating = 4.5;
  const reviewCount = 120;
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
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="star">
                {star <= Math.floor(rating) ? '★' : '☆'}
              </div>
            ))}
          </div>
          <div className="review-count">{rating} ({reviewCount} reviews)</div>
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