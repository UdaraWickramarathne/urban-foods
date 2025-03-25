import './ProductTable.css';
import React, { useState } from 'react';

const ProductTable = ({ products, currentPage, setCurrentPage }) => {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  // Add state for the add product modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
    status: 'Active'
  });

  // Status Badge component
  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  // Icons
  const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  const PrevIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const NextIcon = () => (
    <svg width="16" height="16" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  // Handle opening the modal with product details
  const handleDetailsClick = (product) => {
    setSelectedProduct(product);
    setEditedProduct({...product});
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    if (!editedProduct) return;
    
    const { name, value } = e.target;
    
    setEditedProduct({
      ...editedProduct,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    });
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (!editedProduct) return;
    
    // Here you would typically make an API call to update the product
    // For now, we'll just update the local state
    const updatedProducts = products.map(product => 
      product.id === editedProduct.id ? editedProduct : product
    );
    
    // Update products state (assuming this would be lifted up to parent component in real implementation)
    // For now, this won't persist as we're not updating the parent state
    
    setIsModalOpen(false);
    setSelectedProduct(null);
    setEditedProduct(null);
    
    // Display a success message (in a real app, use a proper toast notification)
    alert('Product updated successfully!');
  };

  // Handle delete product
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete ${selectedProduct.name}?`)) {
      // Here you would typically make an API call to delete the product
      // For now, we'll just update the local state
      const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
      
      // Update products state (assuming this would be lifted up to parent component in real implementation)
      // For now, this won't persist as we're not updating the parent state
      
      setIsModalOpen(false);
      setSelectedProduct(null);
      setEditedProduct(null);
      
      // Display a success message (in a real app, use a proper toast notification)
      alert('Product deleted successfully!');
    }
  };

  // Handle opening the add product modal
  const handleAddProductClick = () => {
    setNewProduct({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  // Handle input change for new product
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    });
  };

  // Handle save new product
  const handleSaveNewProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Here you would typically make an API call to create the product
    // For now, we'll just add it to the local state
    const createdProduct = {
      ...newProduct,
      id: Date.now().toString(), // Generate a temporary ID
    };
    
    // Update products state (assuming this would be lifted up to parent component in real implementation)
    // For now, this won't persist as we're not updating the parent state
    
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
      status: 'Active'
    });
    
    // Display a success message (in a real app, use a proper toast notification)
    alert('Product added successfully!');
  };

  // Handle file upload for edited product
  const handleFileChange = (e) => {
    if (!editedProduct) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Convert the file to a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditedProduct({
        ...editedProduct,
        image: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload for new product
  const handleNewProductFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Convert the file to a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewProduct({
        ...newProduct,
        image: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="products-card">
      <div className="card-header">
        <h2 className="card-title">Products list</h2>
        
        <div className="card-actions">
          <button className="btn btn-secondary btn-with-icon">
            <FilterIcon />
            Filter
          </button>
          
          <button className="btn btn-secondary">
            See All
          </button>
          
          <button 
            className="btn btn-primary btn-with-icon"
            onClick={handleAddProductClick}
          >
            <PlusIcon />
            Add Product
          </button>
        </div>
      </div>
      
      {/* Products table */}
      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th className="name-cell">
                <div className="th-content">
                  Product Name
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Category
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Price
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Stock
                  <ChevronDownIcon />
                </div>
              </th>
              {/* <th>
                <div className="th-content">
                  Status
                  <ChevronDownIcon />
                </div>
              </th> */}
              <th>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="name-cell">
                  <div className="product-info">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    {product.name}
                  </div>
                </td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                {/* <td>
                  <StatusBadge status={product.status} />
                </td> */}
                <td>
                  <button 
                    className="details-button" 
                    onClick={() => handleDetailsClick(product)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="pagination-container">
        <button className="btn btn-pagination">
          <PrevIcon />
          Previous
        </button>
        
        <div className="pagination-numbers">
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <span className="pagination-dots">...</span>
          <button className="page-number">8</button>
          <button className="page-number">9</button>
          <button className="page-number">10</button>
        </div>
        
        <button className="btn btn-pagination">
          Next
          <NextIcon />
        </button>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && editedProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="product-image">Product Image</label>
                <div className="product-image-preview">
                  {editedProduct.image ? (
                    <img src={editedProduct.image} alt={editedProduct.name} />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="file-upload-container">
                  <input 
                    type="file" 
                    id="product-image-file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="product-image-file" className="file-upload-button">
                    <PlusIcon />
                    Upload Image
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="product-name">Product Name</label>
                <input 
                  type="text" 
                  id="product-name" 
                  name="name" 
                  value={editedProduct.name} 
                  onChange={handleInputChange}
                  placeholder="Enter product name" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="product-category">Category</label>
                <input 
                  type="text" 
                  id="product-category" 
                  name="category" 
                  value={editedProduct.category} 
                  onChange={handleInputChange}
                  placeholder="Enter category" 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-price">Price ($)</label>
                  <input 
                    type="number" 
                    id="product-price" 
                    name="price" 
                    value={editedProduct.price} 
                    onChange={handleInputChange}
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="product-stock">Stock</label>
                  <input 
                    type="number" 
                    id="product-stock" 
                    name="stock" 
                    value={editedProduct.stock} 
                    onChange={handleInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="product-status">Status</label>
                <select 
                  id="product-status" 
                  name="status" 
                  value={editedProduct.status} 
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-danger btn-with-icon" 
                onClick={handleDeleteProduct}
              >
                <TrashIcon />
                Delete Product
              </button>
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="new-product-image">Product Image</label>
                {newProduct.image && (
                  <div className="product-image-preview">
                    <img src={newProduct.image} alt="Product preview" />
                  </div>
                )}
                <div className="file-upload-container">
                  <input 
                    type="file" 
                    id="new-product-image-file" 
                    accept="image/*" 
                    onChange={handleNewProductFileChange}
                    className="file-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="new-product-name">Product Name *</label>
                <input 
                  type="text" 
                  id="new-product-name" 
                  name="name" 
                  value={newProduct.name} 
                  onChange={handleNewProductChange}
                  placeholder="Enter product name" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-product-category">Category *</label>
                <input 
                  type="text" 
                  id="new-product-category" 
                  name="category" 
                  value={newProduct.category} 
                  onChange={handleNewProductChange}
                  placeholder="Enter category" 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new-product-price">Price ($)</label>
                  <input 
                    type="number" 
                    id="new-product-price" 
                    name="price" 
                    value={newProduct.price} 
                    onChange={handleNewProductChange}
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="new-product-stock">Stock</label>
                  <input 
                    type="number" 
                    id="new-product-stock" 
                    name="stock" 
                    value={newProduct.stock} 
                    onChange={handleNewProductChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="new-product-status">Status</label>
                <select 
                  id="new-product-status" 
                  name="status" 
                  value={newProduct.status} 
                  onChange={handleNewProductChange}
                >
                  <option value="Active">Active</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveNewProduct}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
