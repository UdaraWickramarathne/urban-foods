import HttpStatus from "../enums/httpsStatus.js";
import userRepository from "../repositories/userRepository.js";

const getUsers = async (req, res) => {
  const result = await userRepository.getAllUsers();
  res.status(HttpStatus.OK).json(result);
};

const registerCustomer = async (req, res) => {
  try {
    // Extract user authentication fields
    const { username, password, role } = req.body;

    // Extract customer profile fields
    const { firstName, lastName, email, phoneNumber, address, imageUrl } = req.body;

    // Create separate objects for different tables
    const userData = { username, password, role };
    const customerData = { firstName, lastName, email, phoneNumber, address, imageUrl };

    // Pass both data objects to repository
    const result = await userRepository.saveCustomer({
      userData,
      customerData,
    });

    if (result) {
      res.status(HttpStatus.CREATED).json({
        message: result.message,
        token: result.token,
        userId: result.userId,
        success: result.success,
      });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Error saving user" });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error saving user",
    });
  }
};

const registerSupplier = async (req, res) => {
  try {
    // Extract user authentication fields
    const { username, password, role } = req.body;

    // Extract supplier profile fields
    const { business_name, email, phoneNumber, address, imageUrl } = req.body;

    // Create separate objects for different tables
    const userData = { username, password, role };
    const supplierData = { business_name, email, phoneNumber, address, imageUrl };

    // Pass both data objects to repository
    const result = await userRepository.saveSupplier({
      userData,
      supplierData,
    });

    if (result) {
      res.status(HttpStatus.CREATED).json({
        message: result.message,
        token: result.token,
        userId: result.userId,
        success: result.success,
      });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Error saving Supplier" });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error saving Supplier",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await userRepository.login({ username, password });

    if (result) {
      res.status(HttpStatus.OK).json({
        message: "Login successful",
        token: result.token,
        userId: result.userId,
        success: result.success,
      });
    } else {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error logging in",
    });
  }
}

export default { getUsers, registerCustomer, registerSupplier, login };
