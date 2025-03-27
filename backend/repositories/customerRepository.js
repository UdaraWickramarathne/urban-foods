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
}
const editCustomer = async (customerId, customerData) => {
  let connection;
  try {
      connection = await getConnection();
      
      const result = await connection.execute(
          `UPDATE customers 
           SET first_name = :firstName,
               last_name = :lastName,
               email = :email,
               address = :address,
               image_url = :imageUrl
           WHERE customer_id = :customerId`,
          {
              firstName: customerData.firstName,
              lastName: customerData.lastName,
              email: customerData.email,
              address: customerData.address,
              imageUrl: customerData.imageUrl,
              customerId: customerId
          }
      );

      await connection.commit();

      if (result.rowsAffected && result.rowsAffected > 0) {
          return {
              success: true,
              message: "Customer updated successfully",
              data: customerData
          };
      } else {
          return {
              success: false,
              message: "Customer not found"
          };
      }
  } catch (error) {
      if (connection) {
          await connection.rollback();
      }
      console.error("Error updating customer:", error.message);
      return {
          success: false,
          message: "Error updating customer"
      };
  } finally {
      if (connection) {
          await connection.close();
      }
  }
};

const deleteCustomer = async (customerId) => {
  let connection;
  try {
      connection = await getConnection();
      
      const result = await connection.execute(
          `DELETE FROM customers WHERE customer_id = :customerId`,
          {
              customerId: customerId
          }
      );

      await connection.commit();

      if (result.rowsAffected && result.rowsAffected > 0) {
          return {
              success: true,
              message: "Customer deleted successfully"
          };
      } else {
          return {
              success: false,
              message: "Customer not found"
          };
      }
  } catch (error) {
      if (connection) {
          await connection.rollback();
      }
      console.error("Error deleting customer:", error.message);
      return {
          success: false,
          message: "Error deleting customer"
      };
  } finally {
      if (connection) {
          await connection.close();
      }
  }
};

export default { getCustomerById, getCustomerByEmail, getAllCustomers,deleteCustomer,editCustomer };
