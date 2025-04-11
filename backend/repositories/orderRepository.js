import { getConnection } from "../db/dbConnection.js";
import oracledb from "oracledb";
import deliveyRepository from "./deliveryRepository.js";

const getAllOrders = async () => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
        o.order_id, 
        c.first_name || ' ' || c.last_name AS customer_name, 
        o.status, 
        o.order_date, 
        o.total_amount, 
        o.address,
        (SELECT COUNT(DISTINCT oi.product_id) 
        FROM OrderItems oi 
        WHERE oi.order_id = o.order_id) AS item_count
      FROM 
          Orders o 
      INNER JOIN 
          Customers c 
      ON 
          o.customer_id = c.customer_id 
      ORDER BY 
          o.order_date DESC

      `
    );

    const orders = result.rows.map((row) => ({
      orderId: row[0],
      customerName: row[1],
      status: row[2],
      orderDate: row[3],
      totalAmount: row[4],
      address: row[5],
      itemCount: row[6],
    }));

    await connection.close();
    return orders;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

const getOrderItems = async (orderId) => {
  try {
    const connection = await getConnection();
    const orderItemResult = await connection.execute(
      `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, 
                    p.name, p.image_url 
             FROM OrderItems oi 
             JOIN Products p ON oi.product_id = p.product_id 
             WHERE oi.order_id = :orderId`,
      [orderId]
    );

    const orederResult = await connection.execute(
      `SELECT o.order_id, o.status, o.order_date, o.total_amount, o.address FROM Orders o WHERE o.order_id = :orderId`,
      [orderId]
    );

    const order = orederResult.rows.map((row) => ({
      orderId: row[0],
      status: row[1],
      orderDate: row[2],
      totalAmount: row[3],
      address: row[4],
    }));

    const orderItems = orderItemResult.rows.map((row) => ({
      orderItemId: row[0],
      orderId: row[1],
      productId: row[2],
      quantity: row[3],
      unitPrice: row[4],
      productName: row[5],
      productImage: row[6],
    }));
    await connection.close();
    return {
      order: order[0],
      items: orderItems,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

const addOrder = async (orderData, orderItemsData) => {
  const connection = await getConnection();
  try {
    console.log("Adding order:", orderData);
    console.log("User ID:", orderData.userId);

    const result = await connection.execute(
      "INSERT INTO Orders (customer_id, status, total_amount, address) VALUES (:customerId, :status, :totalAmount, :address) RETURNING order_id INTO :orderId",
      {
        customerId: orderData.userId,
        status: "PENDING",
        totalAmount: orderData.totalAmount,
        address: orderData.address,
        orderId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    );
    const orderId = result.outBinds.orderId[0];

    for (const item of orderItemsData) {
      await connection.execute(
        "INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES (:orderId, :productId, :quantity, :unitPrice)",
        {
          orderId: orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        }
      );
    }
    await connection.commit();

    await deliveyRepository.addDelevery(orderId);

    return { success: true, orderId: orderId };
  } catch (error) {
    await connection.rollback();
    console.error("Error adding order:", error.message);
    return { success: false, message: error.message };
  } finally {
    await connection.close();
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT o.order_id, o.customer_id, o.status, o.order_date, o.total_amount, o.address,
        (SELECT COUNT(DISTINCT oi.product_id) 
        FROM OrderItems oi 
        WHERE oi.order_id = o.order_id) AS item_count
       FROM Orders o
       WHERE o.customer_id = :userId
       ORDER BY o.order_date`,
      [userId]
    );
    const orders = result.rows.map((row) => {
      // Format the date from ISO format to YYYY-MM-DD
      let formattedDate = null;
      if (row[3]) {
        const date = new Date(row[3]);
        formattedDate = date.toISOString().split("T")[0];
      }
      return {
        orderId: row[0],
        customerId: row[1],
        status: row[2],
        orderDate: formattedDate,
        totalAmount: row[4],
        address: row[5],
        itemCount: row[6],
      };
    });
    await connection.close();
    return orders;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

const updateOrderStatus = async (orderId, statusObj) => {
  try {
    const connection = await getConnection();

    // Extract status value from the object received from frontend
    const statusValue = statusObj.status || statusObj;

    await connection.execute(
      `UPDATE Orders SET status = :status WHERE order_id = :orderId`,
      {
        status: statusValue,
        orderId: orderId,
      }
    );
    await connection.commit();
    await connection.close();
    return { success: true };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: error.message };
  }
};

const getTotalSales = async (startDate = null, endDate = null) => {
  try {
    const connection = await getConnection();

    let query;
    let binds = {};

    if (startDate && endDate) {
      // Call the function with date range
      query = `SELECT get_total_sales(TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD')) AS total_sales FROM DUAL`;
      binds = { startDate, endDate };
    } else {
      // Call the function without parameters for all-time sales
      query = `SELECT get_total_sales() AS total_sales FROM DUAL`;
    }

    const result = await connection.execute(query, binds);
    const totalSales = result.rows[0][0] || 0; // Get the first column of the first row

    await connection.close();
    return { success: true, data: totalSales };
  } catch (error) {
    console.error("Error getting total sales:", error.message);
    return { success: false, message: error.message };
  }
};

const getOrderCount = async (startDate = null, endDate = null) => {
  try {
    const connection = await getConnection();

    let query;
    let binds = {};

    if (startDate && endDate) {
      // Call the function with date range
      query = `SELECT get_completed_order_count(TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD')) AS order_count FROM DUAL`;
      binds = { startDate, endDate };
    } else {
      // Call the function without parameters for all-time order count
      query = `SELECT get_completed_order_count() AS order_count FROM DUAL`;
    }

    const result = await connection.execute(query, binds);
    const orderCount = result.rows[0][0] || 0; // Get the first column of the first row

    await connection.close();
    return { success: true, data: orderCount };
  } catch (error) {
    console.error("Error getting order count:", error.message);
    return { success: false, message: error.message };
  }
};

export default {
  getAllOrders,
  getOrderItems,
  addOrder,
  getOrdersByUserId,
  updateOrderStatus,
  getTotalSales,
  getOrderCount,
};
