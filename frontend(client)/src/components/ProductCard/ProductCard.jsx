import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    setInCart(true);
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="product-card">
      <div className="product-image" onClick={handleCardClick}>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="quantity-controls">
        <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
        <span className="quantity">{quantity}</span>
        <button className="quantity-btn" onClick={increaseQuantity}>+</button>
      </div>
      <div className="product-info" onClick={handleCardClick}>
        <h3 className="product-name">{product.name}</h3>
        <div className="review-rating">{"⭐".repeat(Math.round(product.rating))}</div>
        <p className="product-price">{product.price}</p>
      </div>
      {!inCart ? (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      ) : (
        <button className="in-cart-btn" disabled>
          Added to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;