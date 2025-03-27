import axios from "axios";
import { create } from "zustand";
import HttpStatus from "../enums/httpsStatus";
import { GET_CATEGORY, GET_CUSTOMERS, GET_SUPPLIERS } from "./constants";



export const apiContext = create((set, get) => ({
  // Category API
  addCategory: async (category) => {
    try {
      const response = await axios.post(
        GET_CATEGORY,
        category
      );
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
      const response = await axios.delete(
        `${GET_CATEGORY}/${categoryId}`
      );
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
      const response = await axios.get(GET_CUSTOMERS);
      if (response.status === HttpStatus.OK) {
        console.log("Customers retrieved successfully", response.data);
        return response.data;
      } else {
        console.log("Failed to retrieve customers");
      }
    } catch (error) {
      console.log("Failed to retrieve customers:", error);
    }
  },


  // Supplier API
  getAllSuppliersWithDetails: async () => {
    try {
      const response = await axios.get(GET_SUPPLIERS);
      if (response.status === HttpStatus.OK) {
        return response.data;
      } else {
        console.log("Failed to retrieve suppliers");
      }
    } catch (error) {
      console.log("Failed to retrieve suppliers:", error);
    }
  },


}));
