import HttpStatus from "../enums/httpsStatus.js";
import userRepository from "../repositories/userRepository.js";
import customerRepository from "../repositories/customerRepository.js";

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
    const { firstName, lastName, email, phoneNumber, address, imageUrl } =
      req.body;

    // Basic validation
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Missing required fields: username, password, email, firstName, and lastName are required",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
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
      phoneNumber,
      address,
      imageUrl,
    };

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

    // Pass both data objects to repository
    const result = await userRepository.saveCustomer({
      userData,
      customerData,
    });

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
      message: "Error registering customer",
    });
  }
};

const registerSupplier = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const { business_name, email, phoneNumber, address, imageUrl } = req.body;

    if (!username || !password || !email || !business_name) {
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

    // Create separate objects for different tables
    const userData = {
      username,
      password,
      role: role || "supplier", // Default role
    };

    const supplierData = {
      business_name,
      email,
      phoneNumber,
      address,
      imageUrl,
    };

    // Pass both data objects to repository
    const result = await userRepository.saveSupplier({
      userData,
      supplierData,
    });

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
      message: "Error registering supplier",
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

export default { getUsers, registerCustomer, registerSupplier, login };
