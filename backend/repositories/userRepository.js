import { getConnection } from "../db/dbConnection.js";
import User from "../models/user.js";
import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";
import auth from "../middlewares/auth.js";
import oracledb from "oracledb";

const { generateToken } = auth;

const getAllUsers = async () => {
  try {
    const connection = await getConnection();

    const result = await connection.execute("SELECT * FROM users");
    const users = result.rows.map((row) =>
      User.fromDbRow(row, result.metaData)
    );

    await connection.close();

    return users;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

const saveCustomer = async ({ userData, customerData }) => {
  const connection = await getConnection();

  try {

    const hashedPassword = await hashPassword(userData.password);

    connection.autoCommit = false;

    const result = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (:username, :password, :role) RETURNING user_id INTO :user_id",
      {
        username: userData.username,
        password: hashedPassword,
        role: userData.role,
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
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
        address: customerData.address,
        image_url: customerData.imageUrl
      }
    );

    await connection.commit();

    const token = generateToken(userId, userData.role);

    return {
      token: token,
      userId: userId,
      success: true,
      message: "Customer Registration successful",
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error.message);
    return { success: false, message: "Error saving Customer" };
  } finally {
    await connection.close();
  }
};

const saveSupplier = async ({ userData, supplierData }) => {
  const connection = await getConnection();

  try {

    const hashedPassword = await hashPassword(userData.password);

    connection.autoCommit = false;

    const result = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (:username, :password, :role) RETURNING user_id INTO :user_id",
      {
        username: userData.username,
        password: hashedPassword,
        role: userData.role,
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    const userId = result.outBinds.user_id[0];

    await connection.execute(
      "INSERT INTO suppliers (supplier_id, email, business_name, address, image_url) VALUES (:supplier_id, :email, :business_name, :address, :image_url)",
      {
        supplier_id: userId,
        email: supplierData.email,
        business_name: supplierData.business_name,
        address: supplierData.address,
        image_url: supplierData.imageUrl
      }
    );

    await connection.commit();

    const token = generateToken(userId, userData.role);

    return {
      token: token,
      userId: userId,
      success: true,
      message: "Supplier Registration successful",
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error.message);
    return { success: false, message: "Error saving Supplier" };
  } finally {
    await connection.close();
  }
}

const login = async ({ username, password }) => {
  const connection = await getConnection();

  try {

    const result = await connection.execute(
      "SELECT * FROM users WHERE username = :username",
      {
        username: username,
      }
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = User.fromDbRow(result.rows[0], result.metaData);

    
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    const token = generateToken(user.userId, user.role);

    return {
      token: token,
      userId: user.userId,
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  } finally {
    await connection.close();
  }
}
export default { getAllUsers, saveCustomer, saveSupplier, login };
