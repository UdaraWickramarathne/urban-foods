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
    const { firstName, lastName, email, phoneNumber, address } = req.body;

    // Create separate objects for different tables
    const userData = { username, password, role };
    const customerData = { firstName, lastName, email, phoneNumber, address };

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

export default { getUsers, registerCustomer };
