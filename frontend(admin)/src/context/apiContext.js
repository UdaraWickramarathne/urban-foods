import axios from "axios";
import { create } from "zustand";
import HttpStatus from "../enums/httpsStatus";
import { GET_CATEGORY, CUSTOMERS, SUPPLIERS, REQUEST_OTP, VALIDATE_OTP, USERS, PRODUCTS, ADMIN, ORDERS, BACKUPS, DELIVERY } from "./constants";

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

  // User API
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

  // Product API
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

  // DB Users API
  getAllDbUsers: async () => {
    try {
      const response = await axios.get(ADMIN);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve DB users" };
    }
  },
  createOracleUser: async (userData) => {
    try {
      const response = await axios.post(`${ADMIN}/users`, userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      console.log("Failed to create Oracle user:", error);
    }
    
  },
  getCurrentPermissions: async (username) => {
    try {
      const response = await axios.get(`${ADMIN}/current-privileges/${username}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve current permissions" };
    }
  },
  updateDbUser: async (userData) => {
    try {
      const response = await axios.put(`${ADMIN}/users`, userData );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to update DB user" };
    }
  },
  deleteDbUser: async (username) => {
    try {
      const response = await axios.delete(`${ADMIN}/users/${username}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to delete DB user" };
    }
  },
  // Get all triggers
  getAllTriggers: async () => {
    try {
      const response = await axios.get(`${ADMIN}/triggers`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve triggers" };
    }
  },
  getLogDetails: async (trigger) => {    
    try {
      const response = await axios.post(`${ADMIN}/log`, trigger);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve log details" };
    }
  },
  dropTrigger: async (triggerName) => {
    try {
      const response = await axios.delete(`${ADMIN}/triggers/${triggerName}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to drop trigger" };
    }
  },
  changeTriggerStatus: async (triggerName, status) => {
    try {
      const response = await axios.put(`${ADMIN}/triggers/${triggerName}`, { status });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to change trigger status" };
    }
  },
  getOrders: async () => {
    try {
      const response = await axios.get(ORDERS);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve orders" };
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(`${ORDERS}/${orderId}`, { status });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to update order status" };
    }
  },
  getTotalSales: async () => {
    try {
      const response = await axios.get(`${ORDERS}/totalSales`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve total sales" };
    }
  },
  getBackups: async () => {
    try {
      const response = await axios.get(BACKUPS);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve backups" };
    }
  },
  downloadBackup: async (backupId) => {
    try {
      // Use responseType: 'blob' for binary data
      const response = await axios.get(`${BACKUPS}/${backupId}/download`, {
        responseType: 'blob'
      });
         
      // Get the filename from Content-Disposition header or use a default name
      const contentDisposition = response.headers['content-disposition'];
      let currentTimeStamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      let filename = `urban-food-backup-${currentTimeStamp}.dmp`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a blob URL for the file data
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary anchor element to trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.setAttribute('download', filename);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      
      // Start download
      downloadLink.click();
      
      // Clean up
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);
      
      return { success: true, message: "Download started" };
    } catch (error) {
      if (error.response) {
        return { success: false, message: "Failed to download backup file" };
      }
      return { success: false, message: "Failed to download backup file" };
    }
  },
  createBackup: async () => {
    try {
      const response = await axios.post(BACKUPS);
      return response.data; // This handles successful responses
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to create backup" };
    }
  },
  getSQLFunctions: async () => {
    try {
      const response = await axios.get(`${ADMIN}/functions`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve SQL functions" };
    }
  },
  getSQLFunctionDetails: async (functionName) => {
    try {
      const response = await axios.get(`${ADMIN}/functions/${functionName}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve SQL function details" };
    }
  },
  getProcedures: async () => {
    try {
      const response = await axios.get(`${ADMIN}/procedure`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve procedures" };
    }
  },
  executeProcedure: async (procedureName) => {
    try {
      const response = await axios.get(`${ADMIN}/procedure/${procedureName}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to execute procedure" };
    }
  },
  getProcedureDetails: async (procedureName) => {
    try {
      const response = await axios.get(`${ADMIN}/procedure/${procedureName}/details`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve procedure details" };
    }
  },
  getOrderCount: async () => {
    try {
      const response = await axios.get(`${ORDERS}/orderCount`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve order count" };
    }
  },
  getProductCount: async () => {
    try {
      const response = await axios.get(`${PRODUCTS}/productCount`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve product count" };
    }
  },
  getCustomerCount: async () => {
    try {
      const response = await axios.get(`${CUSTOMERS}/customerCount`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve customer count" };
    }
  },
  getAllDeliveries: async () => {
    try {
      const response = await axios.get(`${DELIVERY}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve deliveries" };
    }
  },
  getDeliveryAgents: async () => {
    try {
      const response = await axios.get(`${DELIVERY}/agents`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to retrieve delivery agents" };
    }
  },
  updateDeliveryStatus: async (deliveryId, status) => {
    try {
      const response = await axios.post(`${DELIVERY}/update-status`, { deliveryId, status });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to update delivery status" };
    }
  },
  assignDeliveryAgent: async (deliveryId, agentId) => {
    try {
      const response = await axios.post(`${DELIVERY}/assign-agent`, { deliveryId, agentId });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Failed to assign delivery agent" };
    }
  },
}));
