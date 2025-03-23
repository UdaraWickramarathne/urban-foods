import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    setInCart(true);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }else{
      setInCart(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
      </div>
      {!inCart ? (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      ) : (
        <div className="quantity-controls">
          <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
          <span className="quantity">{quantity}</span>
          <button className="quantity-btn" onClick={increaseQuantity}>+</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;