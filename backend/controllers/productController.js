import HttpStatus from "../enums/httpsStatus.js";
import imageUpload from "../middlewares/imageUpload.js";
import productRepository from "../repositories/productRepository.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await productRepository.getAllProducts();
    res.status(HttpStatus.OK).json(products);
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving products",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productRepository.getProductById(productId);
    if (product) {
      res.status(HttpStatus.OK).json(product);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error in getProductById controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving product",
    });
  }
};

const insertProduct = async (req, res) => {
  try {
    const productData = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = imageUpload.saveProductImage(
        req.file.buffer,
        req.file.originalname
      );
    }
    productData.imageUrl = imageUrl;
    productData.supplierId = '8';

    const result = await productRepository.insertProduct(productData);
    if (result.success) {
      res.status(201).json({ success: true, productId: result.productId });
    } else {
      console.log("Error in insertProduct:", result.message);
      
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in insertProduct controller:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to insert product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await productRepository.deleteProduct(req.params.productId);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const result = await productRepository.updateProduct(
      req.params.productId,
      req.body
    );
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating product",
    });
  }
};

const searchProducts = async (req, res) => {
  console.log("query", req.query);
  const keyword = req.query.keyword;
  try {
    const products = await productRepository.searchProducts(keyword);
    if (!products) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No products found in this keyword",
      });
    }
    res.status(HttpStatus.OK).json(products);
  } catch (error) {
    console.error("Error in searchProducts controller:", error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error searching products",
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  insertProduct,
  deleteProduct,
  updateProduct,
  searchProducts,
};
