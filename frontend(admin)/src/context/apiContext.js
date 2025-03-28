import axios from "axios";
import { create } from "zustand";
import HttpStatus from "../enums/httpsStatus";
import { GET_CATEGORY, CUSTOMERS, SUPPLIERS, REQUEST_OTP, VALIDATE_OTP, USERS } from "./constants";

export const apiContext = create((set, get) => ({
  // Category API
  addCategory: async (category) => {
    try {
      const response = await axios.post(GET_CATEGORY, category);
      if (response.status === HttpStatus.CREATED) {
        console.log("Category added successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to add category");
      }
    } catch (error) {
      console.log("Failed to add category:", error);
    }
  },
  getAllCategories: async () => {
    try {
      const response = await axios.get(GET_CATEGORY);
      if (response.status === HttpStatus.OK) {
        console.log("Categories retrieved successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to retrieve categories");
      }
    } catch (error) {
      console.log("Failed to retrieve categories:", error);
    }
  },
  deleteCategory: async (categoryId) => {
    try {
      const response = await axios.delete(`${GET_CATEGORY}/${categoryId}`);
      if (response.status === HttpStatus.OK) {
        console.log("Category deleted successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to delete category");
      }
    } catch (error) {
      console.log("Failed to delete category:", error);
    }
  },
  updateCategory: async (categoryId, category) => {
    try {
      const response = await axios.put(
        `${GET_CATEGORY}/${categoryId}`,
        category
      );
      if (response.status === HttpStatus.OK) {
        console.log("Category updated successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to update category");
      }
    } catch (error) {
      console.log("Failed to update category:", error);
    }
  },

  // Customer API
  getCustomers: async () => {
    try {
      const response = await axios.get(CUSTOMERS);
      if (response.status === HttpStatus.OK) {
        return response.data;
      } else {
        console.log("Failed to retrieve customers");
      }
    } catch (error) {
      console.log("Failed to retrieve customers:", error);
    }
  },
  addCustomer: async (customer) => {
    try {
      const response = await axios.post(`${USERS}/customer`, customer);
      if (response.status === HttpStatus.CREATED) {
        console.log("Customer added successfully", response.data);
        return response.data;
      } else if (response.status === HttpStatus.BAD_REQUEST) {
        console.log("Customer already exists", response.data.message);
        return response.data;
      } else {
        console.log("Failed to add customer");
        return null;
      }
    } catch (error) {
      console.log("Failed to add customer:", error);
    }
  },
  requestOtp: async (email) => {
    try {
      const response = await axios.post(REQUEST_OTP, { email });
      if (response.status === HttpStatus.OK) {
        console.log("OTP sent successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to send OTP");
      }
    } catch (error) {
      console.log("Failed to send OTP:", error);
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      const response = await axios.post(VALIDATE_OTP, { email, otp });
      if (response.status === HttpStatus.OK) {
        console.log("OTP verified successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to verify OTP");
      }
    } catch (error) {
      console.log("Failed to verify OTP:", error);
    }
  },
  deleteCustomer: async (customerId) => {
    try {
      const response = await axios.delete(`${USERS}/${customerId}`);
      if (response.status === HttpStatus.OK) {
        console.log("Customer deleted successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to delete customer");
      }
    } catch (error) {
      console.log("Failed to delete customer:", error);
    }
  },
  // Supplier API
  getAllSuppliersWithDetails: async () => {
    try {
      const response = await axios.get(SUPPLIERS);
      if (response.status === HttpStatus.OK) {
        return response.data;
      } else {
        console.log("Failed to retrieve suppliers");
      }
    } catch (error) {
      console.log("Failed to retrieve suppliers:", error);
    }
  },
  updateSupplier: async (supplierId, supplier) => {
    try {
      const response = await axios.put(`${SUPPLIERS}/${supplierId}`, supplier);
      if (response.status === HttpStatus.OK) {
        console.log("Supplier updated successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to update supplier");
      }
    } catch (error) {
      console.log("Failed to update supplier:", error);
    }
  },
  deleteSupplier: async (supplierId) => {
    try {
      const response = await axios.delete(`${SUPPLIERS}/${supplierId}`);
      if (response.status === HttpStatus.OK) {
        console.log("Supplier deleted successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to delete supplier");
      }
    } catch (error) {
      console.log("Failed to delete supplier:", error);
    }
  },
  addSupplier: async (supplier) => {
    try {
      const response = await axios.post(SUPPLIERS, supplier);
      if (response.status === HttpStatus.CREATED) {
        console.log("Supplier added successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to add supplier");
      }
    } catch (error) {
      console.log("Failed to add supplier:", error);
    }
  },
}));
