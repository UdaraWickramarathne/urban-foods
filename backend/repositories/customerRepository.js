import { getConnection } from "../db/dbConnection.js";
import Customer from "../models/customer.js";
import oracledb from "oracledb";


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

const deleteCustomer = async (userId) => {
  let connection;
  try {
      connection = await getConnection();
      
      const result = await connection.execute(
          `DELETE FROM users WHERE user_id = :userId`,
          {
              userId: userId
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

const getCustomersWithTotalSpends = async () => {
  let connection;
  try {
    connection = await getConnection();
    
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
    
    await connection.execute(`BEGIN customer_details; END;`);
    
    const outputResult = await connection.execute(`
      DECLARE
        v_line VARCHAR2(32767);
        v_status INTEGER := 0;
        v_output CLOB := '';
      BEGIN
        LOOP
          DBMS_OUTPUT.GET_LINE(v_line, v_status);
          EXIT WHEN v_status != 0;
          v_output := v_output || v_line || CHR(10);
        END LOOP;
        :output := v_output;
      END;
    `, {
      output: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100000 }
    });
    
    // Parse the output text into an array of customer objects
    const outputText = outputResult.outBinds.output || '';
    const customerLines = outputText.split('\n').filter(line => line.trim() !== '');
    
    const customers = customerLines.map(line => {
      // Parse each line into components
      const customerId = line.match(/Customer ID: (\d+)/)?.[1]?.trim() || '';
      const firstName = line.match(/First Name: ([^,]+)/)?.[1]?.trim() || '';
      const lastName = line.match(/Last Name: ([^,]+)/)?.[1]?.trim() || '';
      const email = line.match(/Email: ([^,]+)/)?.[1]?.trim() || '';
      const address = line.match(/Address: ([^,]+)/)?.[1]?.trim() || '';
      const imageUrl = line.match(/Image Url: ([^,]+)/)?.[1]?.trim() || '';
      const totalSpends = parseFloat(line.match(/Total Spends: ([^ ]+)/)?.[1] || '0');
      
      return {
        customerId,
        firstName,
        lastName,
        email,
        address,
        imageUrl,
        totalSpends
      };
    });
    
    return {success: true, data: customers};
  } catch (error) {
    console.error("Error executing GetAllCustomersWithTotalSpends procedure:", error);
    return {success: false, message: "Error executing procedure" };
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

const getCustomerCount = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN
         :result := get_customer_count();
       END;`,
      { 
        result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );
    
    return {
      success: true,
      count: result.outBinds.result
    };
  } catch (error) {
    console.error("Error getting customer count:", error);
    return {
      success: false,
      message: "Error getting customer count"
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

export default { 
  getCustomerById, 
  getCustomerByEmail, 
  getAllCustomers, 
  deleteCustomer, 
  editCustomer,
  getCustomersWithTotalSpends,
  getCustomerCount 
};
