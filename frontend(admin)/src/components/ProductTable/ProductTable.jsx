import { apiContext } from "../../context/apiContext";
import { PRODUCT_IMAGES } from "../../context/constants";
import { useNotification } from "../../context/notificationContext";
import "./ProductTable.css";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";


const ProductTable = ({ currentPage, setCurrentPage }) => {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  // Add state for edited product image
  const [editedImagePreview, setEditedImagePreview] = useState(null);
  const [editedImageFile, setEditedImageFile] = useState(null);

  const [products, setProducts] = useState([]);

  // Add state for the add product modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });
  // Add state for image preview and file
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  // Add state for categories
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const { getAllCategories, addProduct, getAllProducts, updateProduct, deleteProduct } = apiContext();
  const { showNotification } = useNotification();

  const { userPermissions, handlePermissionCheck } = useAuth();

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);
      try {
        const response = await getAllCategories();
        if (response.success) {
          console.log("Categories fetched successfully:", response.data);
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoryError("Failed to load categories. Please try again later.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (isAddModalOpen || isModalOpen) {
      fetchCategories();
    }
  }, [isAddModalOpen, isModalOpen, getAllCategories]);

  // Status Badge component
  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  // Create a reusable function to fetch and update products data
  const fetchAndUpdateProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.success) {
        console.log("Products fetched successfully:", response.data);
        setProducts(response.data);
      } else {
        console.error("Error fetching products:", response.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateProducts();
  }, []); // Fetch products when component mounts

  // Icons
  const ChevronDownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const PlusIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const FilterIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  const PrevIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const NextIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const TrashIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  // Handle opening the modal with product details
  const handleDetailsClick = (product) => {
    // Make sure we're consistent with category property naming
    const productWithConsistentNames = {
      ...product,
      categoryId: product.categoryId || product.category // Ensure categoryId exists
    };
    setSelectedProduct(productWithConsistentNames);
    setEditedProduct(productWithConsistentNames);
    setEditedImagePreview(product.imageUrl ? `${PRODUCT_IMAGES}/${product.imageUrl}` : null);
    setEditedImageFile(null);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    if (!editedProduct) return;

    const { name, value } = e.target;
    
    // If changing category, update categoryId
    if (name === "categoryId") {
      setEditedProduct({
        ...editedProduct,
        categoryId: value
      });
    } else {
      setEditedProduct({
        ...editedProduct,
        [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
      });
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!editedProduct) return;

    // Create FormData with consistent property naming
    const formData = new FormData();
    formData.append('name', editedProduct.name);
    formData.append('categoryId', editedProduct.categoryId); // Always use categoryId
    formData.append('price', editedProduct.price);
    formData.append('stock', editedProduct.stock);
    
    // If a new image was selected, append it to the form data
    if (editedImageFile) {
      formData.append('image', editedImageFile);
    }

    const result = await updateProduct(selectedProduct.productId, formData);
    if (result.success) {
      showNotification("Product updated successfully!", "success");
      setIsModalOpen(false);
      setSelectedProduct(null);
      setEditedProduct(null);
      setEditedImagePreview(null);
      setEditedImageFile(null);
      
      // Fetch updated product list
      await fetchAndUpdateProducts();
    }
    else {
      showNotification(result.message, "error");
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    // Confirm before deleting
    if (
      window.confirm(`Are you sure you want to delete ${selectedProduct.name}?`)
    ) {
      const result = await deleteProduct(selectedProduct.productId);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setEditedProduct(null);
        showNotification("Product deleted successfully!", "success");
        await fetchAndUpdateProducts();
      }else{
        showNotification(result.message, "error");
      }   
    }
  };

  // Handle file upload for edited product
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the actual file
    setEditedImageFile(file);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle opening the add product modal
  const handleAddProductClick = () => {
    setNewProduct({
      name: "",
      category: categories.length > 0 ? categories[0].id : "",
      price: 0,
      stock: 0,
    });
    setImagePreview(null);
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  // Handle input change for new product
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;

    setNewProduct({
      ...newProduct,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  // Handle save new product
  const handleSaveNewProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock ||
      !imageFile
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
    if (newProduct.price < 0 || newProduct.stock < 0) {
      showNotification("Price and stock must be positive numbers", "error");
      return;
    }

    // Here you would typically create a FormData object and append the form fields
    const formData = new FormData();

    formData.append("name", newProduct.name);
    formData.append("categoryId", newProduct.category);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("image", imageFile);

    const result = await addProduct(formData);
    if (result.success) {
      showNotification("Product added successfully!", "success");
      setIsAddModalOpen(false);
      setNewProduct({
        name: "",
        category: "",
        price: 0,
        stock: 0,
      });
      setImagePreview(null);
      setImageFile(null);
      
      // Fetch updated product list
      await fetchAndUpdateProducts();
    } else {
      showNotification(result.message, "error");
    }
  };

  // Handle file upload for new product
  const handleNewProductFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the actual file
    setImageFile(file);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
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

          <button className="btn btn-secondary">See All</button>

          <button
            className={`btn btn-primary btn-with-icon ${!hasPermission(userPermissions, PERMISSIONS.CREATE_PRODUCTS) ? 'btn-disabled' : ''}`}
            onClick={()=>{
              handlePermissionCheck(PERMISSIONS.CREATE_PRODUCTS, handleAddProductClick, 'You do not have permission to add products.');
            }}
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="name-cell">
                  <div className="product-info">
                    <div className="product-image">
                      <img src={`${PRODUCT_IMAGES}/${product.imageUrl}`} alt={product.name} />
                    </div>
                    {product.name}
                  </div>
                </td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
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
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="product-image">Product Image</label>
                <div className="product-image-preview">
                  {editedImagePreview ? (
                    <img src={editedImagePreview} alt={editedProduct.name} />
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
                  <label
                    htmlFor="product-image-file"
                    className="file-upload-button"
                  >
                    <PlusIcon />
                    Upload Image
                  </label>
                </div>
                {editedImagePreview && editedImageFile && (
                  <button 
                    className="btn btn-text"
                    onClick={() => {
                      setEditedImagePreview(selectedProduct.imageUrl ? `${PRODUCT_IMAGES}/${selectedProduct.imageUrl}` : null);
                      setEditedImageFile(null);
                    }}
                  >
                    Reset image
                  </button>
                )}
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
                {isLoadingCategories ? (
                  <p>Loading categories...</p>
                ) : categoryError ? (
                  <p className="error-message">
                    Error loading categories: {categoryError}
                  </p>
                ) : (
                  <select
                    id="product-category"
                    name="categoryId" // Change to categoryId for consistency
                    value={editedProduct.categoryId || ""} // Use categoryId consistently
                    onChange={handleInputChange}
                    required
                  >
                    {categories.length === 0 && (
                      <option value="">No categories available</option>
                    )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
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
            </div>

            <div className="modal-footer">
              <button
                className={`btn btn-danger btn-with-icon ${!hasPermission(userPermissions, PERMISSIONS.DELETE_PRODUCTS) ? 'btn-disabled' : ''}`}
                onClick={()=>{
                  handlePermissionCheck(PERMISSIONS.DELETE_PRODUCTS, handleDeleteProduct, 'You do not have permission to delete products.');
                }}
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
                <button className={`btn btn-primary ${!hasPermission(userPermissions, PERMISSIONS.EDIT_PRODUCTS)}`} onClick={()=>{
                  handlePermissionCheck(PERMISSIONS.EDIT_PRODUCTS, handleSaveChanges, 'You do not have permission to edit products.');
                }}>
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
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="new-product-image">Product Image</label>
                {imagePreview && (
                  <div className="product-image-preview">
                    <img src={imagePreview} alt="Product preview" />
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
                  <label
                    htmlFor="new-product-image-file"
                    className="file-upload-button"
                  >
                    <PlusIcon />
                    Upload Image
                  </label>
                </div>
                {imagePreview && (
                  <button 
                    className="btn btn-text"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    Remove image
                  </button>
                )}
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
                {isLoadingCategories ? (
                  <p>Loading categories...</p>
                ) : categoryError ? (
                  <p className="error-message">
                    Error loading categories: {categoryError}
                  </p>
                ) : (
                  <select
                    id="new-product-category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    required
                  >
                    {categories.length === 0 && (
                      <option value="">No categories available</option>
                    )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
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
