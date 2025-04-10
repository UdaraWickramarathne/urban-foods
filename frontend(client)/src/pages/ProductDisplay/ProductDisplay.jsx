import React, { useState, useEffect, use } from "react";
import "./ProductDisplay.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import storeContext from "../../context/storeContext";
import { useNotification } from "../../context/notificationContext";

const ProductDisplay = () => {
  // Hardcoded product data
  

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { getAllProducts, getCategories } = storeContext();

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

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data.map((category) => category.name));
      } else {
        showNotification("Failed to fetch categories", "error");
      }
    } catch (error) {
      showNotification("An error occurred while fetching categories", "error");
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
