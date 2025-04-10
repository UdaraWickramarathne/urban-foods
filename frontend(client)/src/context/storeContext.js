import { create } from "zustand";
import {
  CART,
  GET_CATEGORY,
  ORDERS,
  PAYMENT,
  PRODUCTS,
  VALIDATE_TOKEN,
} from "./constants";
import axios from "axios";

const storeContext = create((set, get) => ({
  token: localStorage.getItem("token") || "",
  userId: localStorage.getItem("userId") || "",
  role: localStorage.getItem("role") || "",
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setUserId: (userId) => {
    localStorage.setItem("userId", userId);
    set({ userId });
  },
  setRole: (role) => {
    localStorage.setItem("role", role);
    set({ role });
  },
  validateToken: async () => {
    const { token, setToken, setUserId } = get();
    try {
      const response = await fetch(VALIDATE_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        setToken(token);
        setUserId(data.userId);
      }
    } catch (error) {
      console.error("Failed to validate token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      set({ token: "", userId: "" });
    }
  },
  // get products
  getAllProducts: async () => {
    try {
      const response = await axios.get(PRODUCTS);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  getCategories: async () => {
    try {
      const response = await axios.get(GET_CATEGORY);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  getCartItems: async () => {
    const { userId } = get();
    try {
      const response = await axios.get(`${CART}/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  handleAddToCart: async (productId, quantity) => {
    const { userId } = get();
    try {
      const response = await axios.post(CART, { userId, productId, quantity });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  updateCartItem: async (productId, quantity) => {
    const { userId } = get();
    try {
      const response = await axios.put(`${CART}/${productId}`, {
        userId,
        quantity,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  handleRemoveFromCart: async (productId) => {
    const { userId } = get();
    try {
      const response = await axios.delete(`${CART}/${productId}`, {
        data: { userId },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  handleCheckout: async (orderData) => {
    try {
      const response = await axios.post(`${ORDERS}`, { orderData });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  clearCart: async () => {
    const { userId } = get();
    try {
      const response = await axios.delete(`${CART}/clear/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  updatePaymentStatus: async (orderId) => {
    try {
      const response = await axios.patch(`${PAYMENT}/updatePaymentStatus`, {
        orderId,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  getOrderByUserId: async () => {
    const { userId } = get();
    try {
      const response = await axios.get(`${ORDERS}/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  getOrderItems: async (orderId) => {
    try {
      const response = await axios.get(`${ORDERS}/${orderId}/items`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  },
  getTop10Products: async () => {
    try {
      const response = await axios.get(`${PRODUCTS}/top10`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: error.message };
    }
  }
}));

export default storeContext;
