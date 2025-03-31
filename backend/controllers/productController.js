import HttpStatus from "../enums/httpsStatus.js";
import imageUpload from "../middlewares/imageUpload.js";
import productRepository from "../repositories/productRepository.js";
import fs from "fs";
import path from "path";

const getAllProducts = async (req, res) => {
  try {
    const result = await productRepository.getAllProducts();
    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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

    // !TODO: Remove this hardcoded value ////////////////////////////////////////////////////////////////////////////////////////////////////////
    productData.supplierId = "61";
    console.log("productData.supplierId", productData.supplierId);
    

    const result = await productRepository.insertProduct(productData);
    if (result.success) {
      res.status(201).json({ success: true, productId: result.productId });
    } else {
      // remove saved image if insertProduct fails
      if (imageUrl) {
        const imagePath = path.join(
          process.cwd(),
          "uploads",
          "products",
          imageUrl
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      console.log("Error in insertProduct:", result.message);

      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    if (imageUrl) {
      const imagePath = path.join(
        process.cwd(),
        "uploads",
        "products",
        imageUrl
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    console.error("Error in insertProduct controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to insert product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.productId);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
    const result = await productRepository.deleteProduct(req.params.productId);
    if (result.success) {
      if (product.imageUrl) {
        const imagePath = path.join(
          process.cwd(),
          "uploads",
          "products",
          product.imageUrl
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Product deleted successfully",
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = req.body;
    const productId = req.params.productId;

    const product = await productRepository.getProductById(productId);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }
    // Basic validation for productId
    if (!productId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product ID is required",
      });
    }
    // Basic validation for productData
    if (!productData) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product data is required",
      });
    }
    // Basic validation for productData fields
    if (!productData.name || !productData.price) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product name and price are required",
      });
    }
    // Basic validation for productData fields
    if (isNaN(productData.price)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product price must be a number",
      });
    }
    // Basic validation for productData fields
    if (isNaN(productData.stock)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product stock must be a number",
      });
    }
    // Basic validation for productData fields
    if (!productData.categoryId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product category ID is required",
      });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = imageUpload.saveProductImage(
        req.file.buffer,
        req.file.originalname
      );
      if (product.imageUrl) {
        const oldPath = path.join(
          process.cwd(),
          "uploads",
          "products",
          product.imageUrl
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    productData.imageUrl = imageUrl ? imageUrl : product.imageUrl;

    // !TODO: Remove this hardcoded value ////////////////////////////////////////////////////////////////////////////////////////////////////////

    productData.supplierId = "61";

    // !TODO: Remove this hardcoded value ////////////////////////////////////////////////////////////////////////////////////////////////////////

    const result = await productRepository.updateProduct(
      productId,
      productData
    );

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    console.log("Error in updateProduct controller:", error.message);

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
