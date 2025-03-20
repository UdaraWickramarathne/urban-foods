import React, { useState, useEffect, useRef } from 'react';
import './ProductSection.css';
import ProductCard from '../ProductCard/ProductCard';

const ProductSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  
  // Sample product data
  const products = [
    { id: 1, name: 'Coconut', price: 'Rs 205.00', image: 'https://placehold.co/200x200' },
    { id: 2, name: 'Banana', price: 'Rs 80.00', image: 'https://placehold.co/200x200' },
    { id: 3, name: 'Apple', price: 'Rs 150.00', image: 'https://placehold.co/200x200' },
    { id: 4, name: 'Orange', price: 'Rs 120.00', image: 'https://placehold.co/200x200' },
    { id: 5, name: 'Mango', price: 'Rs 250.00', image: 'https://placehold.co/200x200' },
    { id: 6, name: 'Pineapple', price: 'Rs 180.00', image: 'https://placehold.co/200x200' },
    { id: 7, name: 'Watermelon', price: 'Rs 300.00', image: 'https://placehold.co/200x200' },
    { id: 8, name: 'Papaya', price: 'Rs 190.00', image: 'https://placehold.co/200x200' },
    { id: 9, name: 'Guava', price: 'Rs 130.00', image: 'https://placehold.co/200x200' },
    { id: 10, name: 'Dragon Fruit', price: 'Rs 350.00', image: 'https://placehold.co/200x200' }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex >= products.length - 3) {
          return 0; // Reset to beginning when reaching end
        }
        return newIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  // Update scroll position when currentIndex changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentIndex * 275, // 220px is the width of each product card + margin
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className="product-section">
      <h2>
      Featured <span>Products</span>
      </h2>
      <div className="product-slider-container">
        <div className="product-slider" ref={sliderRef}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;