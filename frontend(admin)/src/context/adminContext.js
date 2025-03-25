import axios from "axios";
import { create } from "zustand";
import HttpStatus from "../enums/httpsStatus";

export const adminContext = create((set, get) => ({
  addCategory: async (category) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/category",
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
      const response = await axios.get("http://localhost:5000/api/category");
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
        `http://localhost:5000/api/category/${categoryId}`
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
        `http://localhost:5000/api/category/${categoryId}`,
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
}));
