import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SupplierProducts.css';
import { PRODUCT_IMAGES } from '../../context/constants';
import { useNotification } from '../../context/notificationContext';

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const  {showNotification} = useNotification()

  const API_URL = 'http://localhost:5000/api/products';
  const CATEGORY_API_URL = 'http://localhost:5000/api/category';

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORY_API_URL);
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const supplierId = localStorage.getItem('userId');
      if (!supplierId) {
        console.error('Supplier ID is missing. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_URL}/supplier/${supplierId}`);
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setModalType('edit');
    setShowModal(true);
    setImagePreview(product.image_url);
  };

  const handleDelete = async (productId) => {
    console.log(productId);
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/${productId}`);
        setProducts(products.filter(product => product.product_id !== productId));
        showNotification('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error.response?.data || error.message);
        alert('Failed to delete the product. Please try again.');
      }
    }
  };

  
  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      image: ''
    });
    setModalType('add');
    setShowModal(true);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setCurrentProduct({
          ...currentProduct,
          image: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentProduct.name || !currentProduct.categoryId || !currentProduct.price || !currentProduct.stock) {
      alert("Please fill out all required fields.");
      return;
    }
  
    const supplierId = localStorage.getItem('userId');
  
    if (!supplierId) {
      alert("Supplier ID is missing. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append('name', currentProduct.name);
    formData.append('categoryId', currentProduct.categoryId);
    formData.append('price', currentProduct.price);
    formData.append('stock', currentProduct.stock);
    formData.append('supplierId', supplierId);
  
    if (currentProduct.image instanceof File) {
      formData.append('image', currentProduct.image);
    }
  
    try {
      if (modalType === 'add') {
        const response = await axios.post(API_URL, formData);
        setProducts([...products, { ...currentProduct, product_id: response.data.productId }]);
        showNotification('Product added successfully', 'success');
      } else {
        await axios.put(`${API_URL}/${currentProduct.productId}`, formData);
        setProducts(products.map(product =>
          product.product_id === currentProduct.product_id ? currentProduct : product
        ));
        showNotification('Update successfully', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
    }
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
            <div className="product-card" key={product.product_id}>
              <div className="product-image">
                <img src={`${PRODUCT_IMAGES}/${product.imageUrl}`} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <span className="product-category">{product.category_name}</span>
                <div className="product-info">
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Stock:</strong> {product.stock} units</p>
                </div>
                <div className="product-actions">
                  <button className="edit-btn" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product.productId)}>
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
                <select
                  name="categoryId"
                  value={currentProduct.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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