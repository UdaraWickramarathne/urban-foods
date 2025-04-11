import HttpStatus from "../enums/httpsStatus.js";
import customerRepository from "../repositories/customerRepository.js";
import fs from "fs";
import path from "path";
import imageUpload from "../middlewares/imageUpload.js";

const editCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customerData = req.body;

    const customer = await customerRepository.getCustomerById(customerId);

    // Basic validation
    if (!customerData.firstName || !customerData.lastName) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields: firstName and lastName are required",
      });
    }
    if (!customerData.address) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing required field: address is required",
      });
    }
    let imageUrl = null;
    if (req.file) {
      imageUrl = imageUpload.saveCustomerImage(
        req.file.buffer,
        req.file.originalname
      );
      if (customer.imageUrl) {
        const oldPath = path.join(
          process.cwd(),
          "uploads",
          "customers",
          customer.imageUrl
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    customerData.imageUrl = imageUrl ? imageUrl : customer.imageUrl;

    const result = await customerRepository.editCustomer(
      customerId,
      customerData
    );

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Customer updated successfully",
        data: result.data,
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating customer",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const result = await customerRepository.deleteCustomer(customerId);

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Customer deleted successfully",
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
      message: "Error deleting customer",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const result = await customerRepository.getCustomerById(customerId);

    if (result) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Customer not found",
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving customer",
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await customerRepository.getAllCustomers();

    if (customers) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: customers,
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No customers found",
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving customers",
    });
  }
};

const getCustomersWithSpends = async (req, res) => {
  try {
    const result = await customerRepository.getCustomersWithTotalSpends();

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No customer spending data found",
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving customer spending data",
      error: error.message,
    });
  }
};

const getCustomerCount = async (req, res) => {
  try {
    const result = await customerRepository.getCustomerCount();

    if (result.success) {
      res.status(HttpStatus.OK).json({
        success: true,
        count: result.count,
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "No customer count found",
      });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving customer count",
    });
  }
}

export default {
  editCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getCustomersWithSpends,
  getCustomerCount
};
