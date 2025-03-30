import axios from "axios";
import { create } from "zustand";
import HttpStatus from "../enums/httpsStatus";
import { GET_CATEGORY, CUSTOMERS, SUPPLIERS, REQUEST_OTP, VALIDATE_OTP, USERS, PRODUCTS } from "./constants";

export const apiContext = create((set, get) => ({
  // Category API
  addCategory: async (category) => {
    try {
      const response = await axios.post(GET_CATEGORY, category);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      console.log("Failed to add category:", error);
    }
  },
  getAllCategories: async () => {
    try {
      const response = await axios.get(GET_CATEGORY);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
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
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
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
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }else{
        return { success: false, message: "Failed to add customer" };
      }
    }
  },
  updateCustomer: async (customerId, customer) => {
    try {
      const response = await axios.put(`${CUSTOMERS}/update/${customerId}`, customer);
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Failed to update customer" };
      }
    }
  },
  requestOtp: async (email) => {
    try {
      const response = await axios.post(REQUEST_OTP, { email });
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Failed to send OTP" };
      }
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      const response = await axios.post(VALIDATE_OTP, { email, otp });
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Failed to verify OTP" };
      }
    }
  },
  deleteUser: async (customerId) => {
    try {
      const response = await axios.delete(`${USERS}/${customerId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      console.log("Failed to delete customer:", error);
    }
  },
  
  // Supplier API
  getAllSuppliersWithDetails: async () => {
    try {
      const response = await axios.get(SUPPLIERS);
      if (response.status === HttpStatus.OK) {
        console.log("Suppliers retrieved successfully", response.data);
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
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Failed to update supplier" };
      }
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
      const response = await axios.post(`${USERS}/supplier`, supplier);
      return response.data; 
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Failed to add supplier" };
      }
    }
  },
  addProduct: async (product) => {
    try {
      const response = await axios.post(`${PRODUCTS}`, product);
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to add product" };
    }
  },
  getAllProducts: async () => {
    try {
      const response = await axios.get(PRODUCTS);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve products" };
    }
  },
  updateProduct: async (productId, product) => {
    try {
      const response = await axios.put(`${PRODUCTS}/${productId}`, product);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, message: "Failed to update product" };
      }
    }
  },
  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`${PRODUCTS}/${productId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to delete product" };
    }
  },

}));
