import React, { useState } from "react";
import Slider from "react-slick";
import "./ProductSection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../ProductCard/ProductCard";

const ProductSection = () => {
  const [autoPlay, setAutoPlay] = useState(true);

  // Sample product data
  const products = [
    { id: 1, name: "Coconut", price: "Rs 205.00", image: "https://placehold.co/200x200" },
    { id: 2, name: "Banana", price: "Rs 80.00", image: "https://placehold.co/200x200" },
    { id: 3, name: "Apple", price: "Rs 150.00", image: "https://placehold.co/200x200" },
    { id: 4, name: "Orange", price: "Rs 120.00", image: "https://placehold.co/200x200" },
    { id: 5, name: "Mango", price: "Rs 250.00", image: "https://placehold.co/200x200" },
    { id: 6, name: "Pineapple", price: "Rs 180.00", image: "https://placehold.co/200x200" },
    { id: 7, name: "Watermelon", price: "Rs 300.00", image: "https://placehold.co/200x200" },
    { id: 8, name: "Papaya", price: "Rs 190.00", image: "https://placehold.co/200x200" },
    { id: 9, name: "Guava", price: "Rs 130.00", image: "https://placehold.co/200x200" },
    { id: 10, name: "Dragon Fruit", price: "Rs 350.00", image: "https://placehold.co/200x200" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Adjust the number of visible slides
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="product-section">
      <h2>
        Featured <span>Products</span>
      </h2>
      <Slider
        {...settings}
        className="product-slider"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
        onTouchStart={() => setAutoPlay(false)}
        onTouchEnd={() => setAutoPlay(true)}
      >
        {products.map((product) => (
          <div className="product-card-wrapper" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductSection;