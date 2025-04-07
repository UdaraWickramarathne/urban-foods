import React, { useState, useRef, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSection.css';
import storeContext from '../../context/storeContext';

const ProductSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsContainerRef = useRef(null);
  const autoScrollRef = useRef(null);

  const { getTop10Products } = storeContext();
  
  // Fetch top 10 products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getTop10Products();
        if (response && response.success && response.data) {
          setProducts(response.data);
          console.log("Top 10 Products:", response.data);
          
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getTop10Products]);

  useEffect(() => {
    const calculateSections = () => {
      const container = productsContainerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const productWidth = 300; // approx width of product card + gap
      const visibleProducts = Math.floor(containerWidth / productWidth);
      const sections = Math.ceil(products.length / visibleProducts);
      
      setTotalSections(Math.max(1, sections));
    };

    calculateSections();
    window.addEventListener('resize', calculateSections);
    
    return () => {
      window.removeEventListener('resize', calculateSections);
    };
  }, [products.length]);

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
          {loading ? (
            <div className="loading">Loading top products...</div>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.productId}
                product={{
                  id: product.productId,
                  name: product.name,
                  category: product.categoryName,
                  price: product.price.toString(),
                  originalPrice: (product.price * 1.2).toFixed(2), // Example calculation for original price
                  discount: 20, // Example discount
                  rating: 4.5, // Default rating
                  reviewCount: 100, // Default review count
                  isNew: product.stock > 0, // Consider in-stock products as new
                  imageUrl: product.imageUrl 
                }}
              />
            ))
          ) : (
            <div className="no-products">No products available</div>
          )}
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
