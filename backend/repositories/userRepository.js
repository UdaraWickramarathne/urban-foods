import { getConnection } from "../db/dbConnection.js";
import User from "../models/user.js";
import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";
import auth from "../middlewares/auth.js";
import oracledb from "oracledb";
import jwt from "jsonwebtoken";

const { generateToken } = auth;

const getAllUsers = async () => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute("SELECT * FROM users");
    return result.rows.map((row) => User.fromDbRow(row, result.metaData));
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new Error(`Failed to fetch users: ${error.message}`);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const getUserByUsername = async (username) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      "SELECT * FROM users WHERE username = :username",
      {
        username: username,
      }
    );

    if (result.rows.length === 0) {
      return null;
    }

    return User.fromDbRow(result.rows[0], result.metaData);
  } catch (error) {
    console.error("Error fetching user by username:", error.message);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const saveCustomer = async ({ userData, customerData }) => {
  console.log("Saving customer:", userData, customerData);
  
  // Validate required fields
  if (!userData.username || !userData.password) {
    return {
      success: false,
      message: "Username and password are required",
    };
  }

  if (
    !customerData.email ||
    !customerData.firstName ||
    !customerData.lastName
  ) {
    return {
      success: false,
      message: "Email, first name, and last name are required",
    };
  }

  let connection;
  try {
    connection = await getConnection();
    const hashedPassword = await hashPassword(userData.password);

    connection.autoCommit = false;

    const result = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (:username, :password, :role) RETURNING user_id INTO :user_id",
      {
        username: userData.username,
        password: hashedPassword,
        role: userData.role || "customer", // Default role if not provided
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    );

    const userId = result.outBinds.user_id[0];

    await connection.execute(
      "INSERT INTO customers (customer_id, email, first_name, last_name, address, image_url) VALUES (:customer_id, :email, :first_name, :last_name, :address, :image_url)",
      {
        customer_id: userId,
        email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        address: customerData.address || null, // Handle optional fields
        image_url: customerData.imageUrl || null,
      }
    );

    await connection.commit();

    const token = generateToken(userId, userData.role || "customer");

    return {
      token: token,
      userId: userId,
      success: true,
      message: "Customer registration successful",
    };
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError.message);
      }
    }

    console.error("Error saving customer:", error.message);

    if (error.message.includes("unique constraint")) {
      return {
        success: false,
        message: "Username or email already exists",
      };
    }

    return {
      success: false,
      message: "Error registering customer",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const saveSupplier = async ({ userData, supplierData }) => {
  // Validate required fields
  if (!userData.username || !userData.password) {
    return {
      success: false,
      message: "Username and password are required",
    };
  }

  if (!supplierData.email || !supplierData.businessName) {
    return {
      success: false,
      message: "Email and business name are required",
    };
  }

  let connection;
  try {
    connection = await getConnection();
    const hashedPassword = await hashPassword(userData.password);

    connection.autoCommit = false;

    // Insert into `users` table
    const result = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (:username, :password, :role) RETURNING user_id INTO :user_id",
      {
        username: userData.username,
        password: hashedPassword,
        role: userData.role || "supplier",
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    );

    const userId = result.outBinds.user_id[0];

    // Insert into `suppliers` table
    await connection.execute(
      "INSERT INTO suppliers (supplier_id, email, business_name, address, image_url) VALUES (:supplier_id, :email, :business_name, :address, :image_url)",
      {
        supplier_id: userId,
        email: supplierData.email,
        business_name: supplierData.businessName,
        address: supplierData.address || null,
        image_url: supplierData.imageUrl || null,
      }
    );

    await connection.commit();

    const token = generateToken(userId, userData.role || "supplier");

    return {
      token: token,
      userId: userId,
      success: true,
      message: "Supplier registration successful",
    };
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError.message);
      }
    }

    console.error("Error saving supplier:", error.message);

    if (error.message.includes("unique constraint")) {
      return {
        success: false,
        message: "Username or email already exists",
      };
    }

    return {
      success: false,
      message: "Error registering supplier",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const saveAdmin = async ({ userData }) => {
  // Validate required fields
  console.log(userData.username);
    
  if (!userData.username || !userData.password) {
    return {
      success: false,
      message: "Username and password are required",
    };
  }

  let connection;
  try {
    connection = await getConnection();
    const hashedPassword = await hashPassword(userData.password);

    connection.autoCommit = false;

    const result = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (:username, :password, :role) RETURNING user_id INTO :user_id",
      {
        username: userData.username,
        password: hashedPassword,
        role: userData.role || "admin", // Default role if not provided
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    );

    const userId = result.outBinds.user_id[0];

    await connection.commit();

    const token = generateToken(userId, userData.role || "admin");

    return {
      token: token,
      userId: userId,
      success: true,
      message: "Admin registration successful",
    };
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError.message);
      }
    }

    console.error("Error saving admin:", error.message);

    if (error.message.includes("unique constraint")) {
      return {
        success: false,
        message: "Username already exists",
      };
    }

    return {
      success: false,
      message: "Error registering admin",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const login = async ({ username, password }) => {
  if (!username || !password) {
    return {
      success: false,
      message: "Username and password are required",
    };
  }

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      "SELECT * FROM users WHERE username = :username",
      {
        username: username,
      }
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    const user = User.fromDbRow(result.rows[0], result.metaData);
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    const token = generateToken(user.userId, user.role);

    return {
      token: token,
      userId: user.userId,
      role: user.role,
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error.message);
    return {
      success: false,
      message: "Error during login process",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const validateToken = async (token) => {
  if (!token) {
    return {
      success: false,
      message: "Token is required"
    };
  }

  try {
    // Since the auth middleware's verifyToken doesn't return a value,
    // we need to use jwt directly to verify and decode the token
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    return {
      success: true,
      message: "Token is valid",
      userId: decoded.user_id,
    };
  } catch (error) {
    console.log("Token validation error:", error.message);
    return {
      success: false,
      message: error.message || "Invalid token"
    };
  }
};

export default {
  getAllUsers,
  saveCustomer,
  saveSupplier,
  login,
  getUserByUsername,
  saveAdmin,
  validateToken
};
