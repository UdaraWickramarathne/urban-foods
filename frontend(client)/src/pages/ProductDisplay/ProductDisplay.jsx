import React, { useState, useEffect, use } from "react";
import "./ProductDisplay.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import storeContext from "../../context/storeContext";
import { useNotification } from "../../context/notificationContext";

const ProductDisplay = () => {
  // Hardcoded product data
  const hardcodedProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: 79.99,
      originalPrice: 129.99,
      discount: 38,
      description:
        "Premium noise-cancelling wireless headphones with 20-hour battery life",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      category: "Wearables",
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      description:
        "Track your fitness goals with heart rate monitoring, GPS, and 7-day battery life",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
      rating: 4.2,
      reviewCount: 95,
      isNew: false,
    },
    {
      id: 3,
      name: "Ultra HD 4K Smart TV",
      category: "Electronics",
      price: 699.99,
      originalPrice: 899.99,
      discount: 22,
      description:
        "55-inch 4K Ultra HD Smart TV with built-in streaming apps and voice control",
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1057&q=80",
      rating: 4.7,
      reviewCount: 215,
      isNew: false,
    },
    {
      id: 4,
      name: "Professional DSLR Camera",
      category: "Photography",
      price: 1299.99,
      originalPrice: 1499.99,
      discount: 13,
      description:
        "24.1MP DSLR camera with 4K video recording and built-in Wi-Fi connectivity",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80",
      rating: 4.8,
      reviewCount: 176,
      isNew: true,
    },
    {
      id: 5,
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: 249.99,
      originalPrice: 329.99,
      discount: 24,
      description:
        "Comfortable ergonomic office chair with lumbar support and adjustable height",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      rating: 4.3,
      reviewCount: 89,
      isNew: false,
    },
    {
      id: 6,
      name: "Portable Bluetooth Speaker",
      category: "Electronics",
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      description:
        "Waterproof portable Bluetooth speaker with 12-hour battery life and deep bass",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80",
      rating: 4.1,
      reviewCount: 112,
      isNew: false,
    },
  ];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(hardcodedProducts);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { getAllProducts } = storeContext();

  const { showNotification } = useNotification();

  // Extract categories on component mount
  useEffect(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];
    setCategories(uniqueCategories);
  }, [products]);

  const fetchProducts = async () => {
    console.log("Fetching products...");
    try {
      const response = await getAllProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        showNotification("Failed to fetch products", "error");
      }
    } catch (error) {
      showNotification("An error occurred while fetching products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search and category filtering
  useEffect(() => {
    let result = products;
    // Filter by search term
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.categoryName === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="product-display-container">
      <h1>Our Products</h1>

      <div className="filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <p>No products found. Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
