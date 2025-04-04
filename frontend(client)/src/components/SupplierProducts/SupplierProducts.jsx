import React, { useState, useEffect } from 'react';
import './SupplierProducts.css';

const SupplierProducts = () => {
  // Sample product data (replace with API call)
  const [products, setProducts] = useState([
    { id: 1, name: 'Organic Tomatoes', category: 'Vegetables', price: 2.99, stock: 150, image: 'https://images.unsplash.com/photo-1546470427-f5e2c6ad26e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Fresh Apples', category: 'Fruits', price: 1.49, stock: 200, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Whole Grain Bread', category: 'Bakery', price: 3.25, stock: 75, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Chicken Breast', category: 'Meat', price: 5.99, stock: 50, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle edit product
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setModalType('edit');
    setShowModal(true);
    setImagePreview(product.image); // Set the image preview when editing
  };
  
  // Handle delete product
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  // Handle add new product
  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      image: ''
    });
    setModalType('add');
    setShowModal(true);
    setImagePreview(null); // Reset the image preview
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setCurrentProduct({
          ...currentProduct,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      const newProduct = {
        ...currentProduct,
        id: products.length + 1
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(product => 
        product.id === currentProduct.id ? currentProduct : product
      ));
    }
    setShowModal(false);
  };
  
  return (
    <div className="supplier-products-container">
      <div className="products-header">
        <h1>Manage Products</h1>
        <div className="actions-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-product-btn" onClick={handleAdd}>
            Add New Product
          </button>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <span className="product-category">{product.category}</span>
                <div className="product-info">
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Stock:</strong> {product.stock} units</p>
                </div>
                <div className="product-actions">
                  <button className="edit-btn" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found. Try a different search or add a new product.</p>
          </div>
        )}
      </div>
      
      {showModal && (
        <div className="modal-backdrop">
          <div className="product-modal">
            <div className="modal-header">
              <h2>{modalType === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={currentProduct.name} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  name="category" 
                  value={currentProduct.category} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={currentProduct.price} 
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={currentProduct.stock} 
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group image-upload-container">
                <label>Product Image</label>
                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Product preview" />
                      <button 
                        type="button" 
                        className="change-image-btn" 
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder" onClick={() => document.getElementById('image-upload').click()}>
                      <i className="upload-icon">📷</i>
                      <p>Click to upload image</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {modalType === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierProducts;
