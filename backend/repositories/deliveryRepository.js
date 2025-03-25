import { getConnection } from "../db/dbConnection.js";
import Delivery from "../models/delivery.js";
import oracledb from 'oracledb';
import { format } from 'date-fns';

const getAllDeliveries = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM Deliveries`);
    return result.rows.map((row) => Delivery.fromDbRow(row, result.metaData));
  } catch (error) {
    console.error("Error retrieving deliveries:", error.message);
    return [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getDeliveryById = async (deliveryId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM Deliveries WHERE delivery_id = :deliveryId`,
      { deliveryId }
    );
    return result.rows.length ? Delivery.fromDbRow(result.rows[0], result.metaData) : null;
  } catch (error) {
    console.error("Error retrieving delivery by ID:", error.message);
    return null;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const insertDelivery = async (deliveryData) => {
  console.log("insertDelivery repository");
  console.log(deliveryData);
  let connection;
  try {
    connection = await getConnection();
    // Use a simpler approach for getting the ID back
    const result = await connection.execute(
  `INSERT INTO Deliveries (order_id, status, estimated_date, tracking_number) 
   VALUES (:orderId, :status, TO_DATE(:estimatedDate, 'YYYY-MM-DD'), :trackingNumber) 
   RETURNING delivery_id INTO :deliveryId`,
  {
    orderId: deliveryData.orderId,
    status: deliveryData.status,
    estimatedDate: deliveryData.estimatedDate,
    trackingNumber: deliveryData.trackingNumber,
    deliveryId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  },
  { autoCommit: true } // Ensure auto-commit
);
    
    console.log("Query executed successfully");
    console.log(result);
    
    // Make sure we're accessing the outBinds correctly
    const deliveryId = result.outBinds.deliveryId[0];
    return { success: true, deliveryId };
  } catch (error) {
    console.error("Error inserting delivery:", error);  // Log full error object
    return { success: false, message: error.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Connection closed");
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

const deleteDelivery = async (deliveryId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute("DELETE FROM Deliveries WHERE delivery_id = :deliveryId", {
      deliveryId,
    });
    await connection.commit();
    return { success: true, message: "Delivery deleted successfully" };
  } catch (error) {
    console.error("Error deleting delivery:", error.message);
    return { success: false, message: "Error deleting delivery" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const updateDelivery = async (deliveryId, updatedData) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `UPDATE Deliveries SET 
        order_id = :orderId, 
        status = :status, 
        estimated_date = TO_DATE(:estimatedDate, 'YYYY-MM-DD'), 
        tracking_number = :trackingNumber 
       WHERE delivery_id = :deliveryId`,
      {
        orderId: updatedData.orderId,
        status: updatedData.status,
        estimatedDate: updatedData.estimatedDate, // Ensure this is in 'YYYY-MM-DD' format
        trackingNumber: updatedData.trackingNumber,
        deliveryId,
      },
      { autoCommit: true }
    );
    return { success: true, message: "Delivery updated successfully" };
  } catch (error) {
    console.error("Error updating delivery:", error.message);
    return { success: false, message: "Error updating delivery" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

export default { getAllDeliveries, getDeliveryById, insertDelivery, deleteDelivery, updateDelivery };