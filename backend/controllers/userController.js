import HttpStatus from "../enums/httpsStatus.js";
import userRepository from "../repositories/userRepository.js";
import customerRepository from "../repositories/customerRepository.js";
import fs from "fs";
import path from "path";
import imageUpload from "../middlewares/imageUpload.js";
import supplierRepository from "../repositories/supplierRepository.js";

const getUsers = async (req, res) => {
  try {
    const result = await userRepository.getAllUsers();
    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

const registerCustomer = async (req, res) => {
  try {
    // Extract user authentication fields
    const { username, password, role } = req.body;

    // Extract customer profile fields
    const { firstName, lastName, email, address } = req.body;
    
    //Basic validation
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Missing required fields: username, password, email, firstName, and lastName are required",
      });
    }
    if (password.length < 8) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const isEmailExists = await customerRepository.getCustomerByEmail(email);

    if (isEmailExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email is already exists",
      });
    }

    const isUsernameExists = await userRepository.getUserByUsername(username);

    if (isUsernameExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username is already exists",
      });
    }
    
    // Save image only after validation passes
    let imageUrl = null;
    if (req.file) {
      imageUrl = imageUpload.saveCustomerImage(req.file.buffer, req.file.originalname);
    }

    // Create separate objects for different tables
    const userData = {
      username,
      password,
      role: role || "customer", // Default role
    };

    const customerData = {
      firstName,
      lastName,
      email,
      address,
      imageUrl,
    };
    
    // Pass both data objects to repository
    const result = await userRepository.saveCustomer({
      userData,
      customerData,
    });
    
    if (!result) {
      // Delete the saved image if user creation fails
      if (imageUrl) {
        const imagePath = path.join(process.cwd(), "uploads", "customers", imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during registration",
      });
    }

    if (!result.success) {
      // Delete the saved image if user creation fails
      if (imageUrl) {
        const imagePath = path.join(process.cwd(), "uploads", "customers", imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: result.message,
      token: result.token,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error registering customer",
    });
  }
};

const registerSupplier = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const { businessName, email, address } = req.body;

    if (!username || !password || !email || !businessName) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Missing required fields: username, password, email, and business_name are required",
      });
    }

    if (password.length < 6) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const isBusinessNameExists = await supplierRepository.getSupplierByBusinessName(businessName);
    if (isBusinessNameExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Business name is already exists",
      });
    }

    const isUsernameExists = await userRepository.getUserByUsername(username);

    if (isUsernameExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username is already exists",
      });
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = imageUpload.saveSupplierImage(req.file.buffer, req.file.originalname);
    }


    // Create separate objects for different tables
    const userData = {
      username,
      password,
      role: role || "supplier", // Default role
    };

    const supplierData = {
      businessName,
      email,
      address,
      imageUrl,
    };

    // Pass both data objects to repository
    const result = await userRepository.saveSupplier({
      userData,
      supplierData,
    });

    if (!result) {
      // Delete the saved image if user creation fails
      if (imageUrl) {
        const imagePath = path.join(process.cwd(), "uploads", "suppliers", imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during registration",
      });
    }

    if (!result.success) {
      // Delete the saved image if user creation fails
      if (imageUrl) {
        const imagePath = path.join(process.cwd(), "uploads", "suppliers", imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: result.message,
      token: result.token,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error registering supplier",
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const userData = {
      username,
      password,
      role: role || "admin", // Default role
    };

    const result = await userRepository.saveAdmin({ userData });

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during registration",
      });
    }

    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: result.message,
      token: result.token,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error registering admin",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await userRepository.login({ username, password });

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during login",
      });
    }

    if (!result.success) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: result.message,
      token: result.token,
      userId: result.userId,
      role: result.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error logging in",
    });
  }
};

const validateToken = async (req, res) => {
  try {
    // Extract token from request headers and split it one line
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Token is required",
      });
    }

    const result = await userRepository.validateToken(token);

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during token validation",
      });
    }

    if (!result.success) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Valid token",
      userId: result.userId,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error validating token",
    });
  }
}

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const customer = await customerRepository.getCustomerById(userId);
    const supplier = await supplierRepository.getSupplierById(userId);
    if (!customer && !supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Customer not found",
      });
    }
    if(customer && customer.imageUrl ) {
      const oldPath = path.join(
        process.cwd(),
        "uploads",
        "customers",
        customer.imageUrl
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }else if(supplier && supplier.imageUrl) {
      const oldPath = path.join(
        process.cwd(),
        "uploads",
        "suppliers",
        supplier.imageUrl
      )
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const result = await userRepository.deleteUser(userId);

    if (result) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting user",
    });
  }
}

export default {
  getUsers,
  registerCustomer,
  registerSupplier,
  login,
  registerAdmin,
  validateToken,
  deleteUser
};
