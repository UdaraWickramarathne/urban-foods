import React, { useState } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import ProductCard from "../ProductCard/ProductCard";

const products = [
  {
    id: 1,
    name: "Caesar Salad",
    image: "src/assets/tomato.png",
    price: "$10",
    description: "A classic Caesar Salad with fresh lettuce, croutons, and Caesar dressing.",
    rating: 4.5,
    reviewsCount: 45,
    reviews: [
      {
        reviewer: "John D.",
        date: "Reviewed yesterday",
        rating: 5,
        text: "Fresh and delicious! The dressing was perfect."
      },
      {
        reviewer: "Emily R.",
        date: "Reviewed 2 days ago",
        rating: 4,
        text: "Great salad, but could use more croutons."
      }
    ]
  },
];

const ExploreMenu = ({ category, setCategory }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
  };

  const filteredProducts = products

  return (
    <div className="explore-menu" id="explore-menu">
      <div className="search-bar-container">
      <div className="typing-animation">
          <p>
            <span className="typing-text">Search what you want</span>
          </p>
        </div>
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Products"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {searchInput && (
            <button className="clear-button" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>
      </div>
      <h1>Explore our menu</h1>
      <div className="explore-menu-list">
        {menu_list
          .filter((item) =>
            item.menu_name.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((item, index) => (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p className={category === item.menu_name ? "active-name" : ""}>
                {item.menu_name}
              </p>
            </div>
          ))}
      </div>
      <hr />
      <div className="product-section">
        <h2>{category === "All" ? "All Products" : `${category} Products`}</h2>
        <div className="product-list">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreMenu;