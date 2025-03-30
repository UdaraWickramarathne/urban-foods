import { getConnection } from "../db/dbConnection.js";
import oracledb from "oracledb";
import Supplier from "../models/supplier.js";

const getAllSuppliersWithDetails = async () => {
  let connection;
  try {
    // Get a connection from the pool
    connection = await getConnection();

    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    await connection.execute(`BEGIN get_suppliers_details; END;`);

    // Get the output buffer
    const result = await connection.execute(
      `BEGIN DBMS_OUTPUT.GET_LINES(:lines, :numlines); END;`,
      {
        lines: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxArraySize: 5000,
        },
        numlines: {
          dir: oracledb.BIND_INOUT,
          type: oracledb.NUMBER,
          val: 5000,
        },
      }
    );

    // Process the output and structure it as suppliers array
    const outputLines = result.outBinds.lines || [];
    const suppliers = [];
    let currentSupplier = {};

    if (outputLines && outputLines.length > 0) {
      for (let i = 0; i < outputLines.length; i++) {
        const line = outputLines[i];

        // Skip null or undefined lines
        if (!line) continue;

        if (line.startsWith("Supplier ID: ")) {
          // If we were processing a supplier before, add it to the array
          if (Object.keys(currentSupplier).length > 0) {
            suppliers.push(currentSupplier);
          }
          // Start a new supplier
          currentSupplier = {
            supplierId: parseInt(line.replace("Supplier ID: ", "")),
          };
        } else if (line.startsWith("Supplier Name: ")) {
          currentSupplier.businessName = line.replace("Supplier Name: ", "");
        } else if (line.startsWith("Supplier Email: ")) {
          currentSupplier.email = line.replace("Supplier Email: ", "");
        } else if (line.startsWith("Supplier Address: ")) {
          currentSupplier.address = line.replace("Supplier Address: ", "");
        }else if(line.startsWith("Supplier Image: ")) {
          currentSupplier.imageUrl = line.replace("Supplier Image: ", "");
        }else if (line.startsWith("Product Count: ")) {
          currentSupplier.productCount = parseInt(
            line.replace("Product Count: ", "")
          );
        } else if (line.startsWith("Total Sales: ")) {
          // Handle null value from database
          const salesValue = line.replace("Total Sales: ", "");
          currentSupplier.totalSales =
            salesValue === "" || salesValue === "null"
              ? 0
              : parseFloat(salesValue);
        } else if (line.startsWith("Successful Order Count: ")) {
          currentSupplier.successOrderCount = parseInt(
            line.replace("Successful Order Count: ", "")
          );
        }

        // If we're at the separator line and have a complete supplier, add it
        if (
          line.startsWith("------------") &&
          Object.keys(currentSupplier).length > 0
        ) {
          suppliers.push(currentSupplier);
          currentSupplier = {};
        }
      }

      // Add the last supplier if it wasn't added yet
      if (Object.keys(currentSupplier).length > 0) {
        suppliers.push(currentSupplier);
      }
    }

    // Make sure we're not returning an empty array without explanation
    if (suppliers.length === 0) {
      console.log("No supplier data returned from the stored procedure");
      // Optionally log the raw output for debugging
      console.log("Raw output:", outputLines);
    }

    return { success: true, data: suppliers };
  } catch (error) {
    console.error("Error in getAllSuppliersWithDetails:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      try {
        // Release the connection back to the pool
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
};

const updateSupplier = async (supplierId, supplier) => {
  
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `UPDATE suppliers SET business_name = :businessName, email = :email, address = :address, image_url = :imageUrl WHERE supplier_id = :supplierId`,
      {
        businessName: supplier.businessName,
        email: supplier.email,
        address: supplier.address,
        imageUrl: supplier.imageUrl,
        supplierId,
      },
      { autoCommit: true }
    );
    return {
      success: true,
      message: "Supplier updated successfully",
    };
  } catch (error) {
    console.error("Error updating supplier:", error);
    return {
      success: false,
      message: "Error updating supplier",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
};

const deleteSupplier = async (supplierId) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `DELETE FROM suppliers WHERE supplier_id = :supplierId`,
      { supplierId },
      { autoCommit: true }
    );
    return {
      success: true,
      message: "Supplier deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return {
      success: false,
      message: "Error deleting supplier",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
};

const addSupplier = async (supplier) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `INSERT INTO suppliers (business_name, email, address, image_url) VALUES (:businessName, :email, :address, :imageUrl)`,
      {
        businessName: supplier.businessName,
        email: supplier.email,
        address: supplier.address,
        imageUrl: supplier.imageUrl,
      },
      { autoCommit: true }
    );
    return {
      success: true,
      message: "Supplier added successfully",
    };
  } catch (error) {
    console.error("Error adding supplier:", error);
    return {
      success: false,
      message: "Error adding supplier",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const  getSupplierByEmail = async (email) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT * FROM suppliers WHERE email = :email`,
      { email }
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; 
    }
  } catch (error) {
    console.error("Error fetching supplier by email:", error);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const getSupplierByBusinessName = async (businessName) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT * FROM suppliers WHERE business_name = :businessName`,
      { businessName }
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; 
    }
  } catch (error) {
    console.error("Error fetching supplier by business name:", error);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}

const getSupplierById = async (supplierId) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT * FROM suppliers WHERE supplier_id = :supplierId`,
      { supplierId }
    );

    if (result.rows.length > 0) {
      return Supplier.fromDbRow(result.rows[0], result.metaData);
    } else {
      return null; 
    }
  } catch (error) {
    console.error("Error fetching supplier by ID:", error);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}
export default { getAllSuppliersWithDetails, updateSupplier, deleteSupplier, addSupplier, getSupplierByEmail, getSupplierByBusinessName, getSupplierById };