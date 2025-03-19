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
      "INSERT INTO customers (customer_id, email, first_name, last_name, address) VALUES (:customer_id, :email, :first_name, :last_name, :address)",
      {
        customer_id: userId,
        email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        address: customerData.address,
      }
    );

    await connection.commit();

    const token = generateToken(userId, userData.role);

    return {
      token: token,
      userId: userId,
      success: true,
      message: "Registration successful",
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error.message);
    return { success: false, message: "Error saving user" };
  } finally {
    await connection.close();
  }
};

export default { getAllUsers, saveCustomer };
