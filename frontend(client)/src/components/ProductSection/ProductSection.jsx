import React, { useState, useRef, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSection.css';

const ProductSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const productsContainerRef = useRef(null);
  const autoScrollRef = useRef(null);
  
  // Mock data for top 10 products
  const topProducts = [
    {
      id: 1,
      name: "Ultra Comfort Wireless Headphones",
      category: "Headphones",
      price: "149.99",
      originalPrice: "199.99",
      discount: 25,
      rating: 4.2,
      reviewCount: 128,
      isNew: true,
      image: "https://placehold.co/400x320"
    },
    {
      id: 2,
      name: "Premium Bluetooth Speaker",
      category: "Speakers",
      price: "89.99",
      originalPrice: "119.99",
      discount: 25,
      rating: 4.5,
      reviewCount: 95,
      isNew: false,
      image: "https://placehold.co/400x320"
    },
    {
      id: 3,
      name: "Noise Cancelling Earbuds",
      category: "Earphones",
      price: "129.99",
      originalPrice: "169.99",
      discount: 23,
      rating: 4.7,
      reviewCount: 203,
      isNew: true,
      image: "https://placehold.co/400x320"
    },
    {
      id: 4,
      name: "Smart Watch Pro",
      category: "Wearables",
      price: "199.99",
      originalPrice: "249.99",
      discount: 20,
      rating: 4.4,
      reviewCount: 156,
      isNew: false,
      image: "https://placehold.co/400x320"
    },
    {
      id: 5,
      name: "Ultra HD Action Camera",
      category: "Cameras",
      price: "249.99",
      originalPrice: "299.99",
      discount: 17,
      rating: 4.3,
      reviewCount: 87,
      isNew: false,
      image: "https://placehold.co/400x320"
    },
    {
      id: 6,
      name: "Gaming Mechanical Keyboard",
      category: "Gaming",
      price: "79.99",
      originalPrice: "99.99",
      discount: 20,
      rating: 4.6,
      reviewCount: 142,
      isNew: true,
      image: "https://placehold.co/400x320"
    },
    {
      id: 7,
      name: "Ergonomic Computer Mouse",
      category: "Computer Accessories",
      price: "59.99",
      originalPrice: "74.99",
      discount: 20,
      rating: 4.1,
      reviewCount: 112,
      isNew: false,
      image: "https://placehold.co/400x320"
    },
    {
      id: 8,
      name: "Fast Charging Power Bank",
      category: "Chargers",
      price: "49.99",
      originalPrice: "69.99",
      discount: 29,
      rating: 4.8,
      reviewCount: 231,
      isNew: false,
      image: "https://placehold.co/400x320"
    },
    {
      id: 9,
      name: "Waterproof Bluetooth Speaker",
      category: "Speakers",
      price: "69.99",
      originalPrice: "89.99",
      discount: 22,
      rating: 4.0,
      reviewCount: 76,
      isNew: true,
      image: "https://placehold.co/400x320"
    },
    {
      id: 10,
      name: "Wireless Gaming Controller",
      category: "Gaming",
      price: "54.99",
      originalPrice: "74.99",
      discount: 27,
      rating: 4.5,
      reviewCount: 189,
      isNew: false,
      image: "https://placehold.co/400x320"
    }
  ];

  useEffect(() => {
    const calculateSections = () => {
      const container = productsContainerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const productWidth = 300; // approx width of product card + gap
      const visibleProducts = Math.floor(containerWidth / productWidth);
      const sections = Math.ceil(topProducts.length / visibleProducts);
      
      setTotalSections(sections);
    };

    calculateSections();
    window.addEventListener('resize', calculateSections);
    
    return () => {
      window.removeEventListener('resize', calculateSections);
    };
  }, [topProducts.length]);

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!isPaused) {
          const nextIndex = (currentIndex + 1) % totalSections;
          setCurrentIndex(nextIndex);
          scrollToSection(nextIndex);
        }
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [currentIndex, totalSections, isPaused]);

  const pauseAutoScroll = () => setIsPaused(true);
  const resumeAutoScroll = () => setIsPaused(false);

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToSection(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < totalSections - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToSection(currentIndex + 1);
    }
  };

  const scrollToSection = (index) => {
    const container = productsContainerRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const productWidth = 300; // approx width of product card + gap
    const visibleProducts = Math.floor(containerWidth / productWidth);
    
    const scrollAmount = index * visibleProducts * productWidth;
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
    scrollToSection(index);
  };

  return (
    <section className="product-section">
      <div className="section-header">
        <h2>Top 10 Products</h2>
        <p>Our most popular items chosen by customers</p>
      </div>
      <div className="products-wrapper" 
           onMouseEnter={pauseAutoScroll} 
           onMouseLeave={resumeAutoScroll}>
        <div className="products-container" ref={productsContainerRef}>
          {topProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
      <div className="navigation-controls">
        <button 
          className={`nav-button prev ${currentIndex === 0 ? 'disabled' : ''}`} 
          onClick={scrollLeft}
          aria-label="Previous products"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className="indicators">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
        <button 
          className={`nav-button next ${currentIndex === totalSections - 1 ? 'disabled' : ''}`} 
          onClick={scrollRight}
          aria-label="Next products"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ProductSection;
