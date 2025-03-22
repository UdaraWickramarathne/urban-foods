import { getConnection } from "../db/dbConnection.js";
import Customer from "../models/customer.js";

const getCustomerById = async (customerId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      "SELECT * FROM customers WHERE customer_id = :customerId",
      {
        customerId,
      }
    );
    if (result.rows.length === 0) {
      return null;
    }
    return Customer.fromDbRow(result.rows[0], result.metaData);
  } catch (error) {
    console.error("Error getting customer by ID:", error);
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

const getCustomerByEmail = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      "SELECT * FROM customers WHERE email = :email",
      {
        email,
      }
    );
    if (result.rows.length === 0) {
      return null;
    }
    return Customer.fromDbRow(result.rows[0], result.metaData);
  } catch (error) {
    console.error("Error getting customer by email:", error);
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

const getAllCustomers = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute("SELECT * FROM customers");
    return result.rows.map((row) => Customer.fromDbRow(row, result.metaData));
  } catch (error) {
    console.error("Error getting all customers:", error);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
}

export default { getCustomerById, getCustomerByEmail, getAllCustomers };
