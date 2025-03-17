import React, { useState } from "react";
import Slider from "react-slick";
import "./ProductSection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const products = [
  {
    id: 1,
    name: "Fresh Orange",
    price: "Rs.390.50",
    image: "src/images/product-1.png",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Onion",
    price: "Rs.120.00",
    image: "src/images/product-2.png",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Meat",
    price: "Rs.390.50",
    image: "src/images/product-3.png",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Onion",
    price: "Rs.390.50",
    image: "src/images/product-4.png",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Meat",
    price: "Rs.120.00",
    image: "src/images/product-5.png",
    rating: 4.5,
  },
];

const ProductSection = () => {
  const [autoPlay, setAutoPlay] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="products-section">
      <h2>
        Our <span>Products</span>
      </h2>
      <Slider
        {...settings}
        className="products-container"
        onMouseEnter={() => setAutoPlay(true)}
        onMouseLeave={() => setAutoPlay(false)}
      >
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <div className="rating">⭐ ⭐ ⭐ ⭐ ⭐</div>
            <button>Add To Cart</button>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductSection;
