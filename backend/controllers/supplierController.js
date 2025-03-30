import HttpStatus from "../enums/httpsStatus.js";
import imageUpload from "../middlewares/imageUpload.js";
import supplierRepository from "../repositories/supplierRepository.js";
import path from "path";
import fs from "fs";

const getAllSuppliersWithDetails = async (req, res) => {
  try {
    const result = await supplierRepository.getAllSuppliersWithDetails();
    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Suppliers retrieved successfully",
        data: result.data,
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve suppliers",
    });
  }
};

const updateSupplier = async (req, res) => {
  try {

    
    const supplierId = req.params.supplierId;
    const supplierData = req.body;


    const supplier = await supplierRepository.getSupplierById(supplierId);
    if (!supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Supplier not found",
      });
    }    
    
    // Basic validation for required fields
    if (
      !supplierData.businessName ||
      !supplierData.email ||
      !supplierData.address
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Business name, email, and address are required",
      });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = imageUpload.saveSupplierImage(
        req.file.buffer,
        req.file.originalname
      );
      if (supplier.imageUrl) {
        const oldPath = path.join(
          process.cwd(),
          "uploads",
          "suppliers",
          supplier.imageUrl
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    supplierData.imageUrl = imageUrl ? imageUrl : supplier.imageUrl;
    
    const result = await supplierRepository.updateSupplier(
      supplierId,
      supplierData
    );

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Supplier updated successfully",
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.log("Error updating supplier:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating supplier",
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const result = await supplierRepository.deleteSupplier(supplierId);

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Supplier deleted successfully",
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting supplier",
    });
  }
};

const addSupplier = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.filename : null;
    const supplier = req.body;
    supplier.imageUrl = imageUrl;
    const result = await supplierRepository.addSupplier(supplier);

    if (result.success) {
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Supplier added successfully",
        data: result.data,
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error adding supplier",
    });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const result = await supplierRepository.getSupplierById(supplierId); // Correct repository

    if (result) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Supplier not found",
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving supplier",
    });
  }
};


export default {
  getAllSuppliersWithDetails,
  updateSupplier,
  deleteSupplier,
  addSupplier,
  getSupplierById
};
