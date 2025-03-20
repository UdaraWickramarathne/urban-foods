import { getConnection } from "../db/dbConnection.js";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import oracledb from 'oracledb';

const getAllOrders = async () => {
    try {
        const connection = await getConnection();
        const result = await connection.execute("SELECT * FROM Orders");
        const orders = result.rows.map((row) => Order.fromDbRow(row, result.metaData));
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
        const result = await connection.execute(
            `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, 
                    p.product_name, p.product_image 
             FROM OrderItems oi 
             JOIN Products p ON oi.product_id = p.product_id 
             WHERE oi.order_id = :orderId`,
            [orderId]
        );
        const orderItems = result.rows.map((row) => ({
            orderItemId: row[0],
            orderId: row[1],
            productId: row[2],
            quantity: row[3],
            unitPrice: row[4],
            productName: row[5],
            productImage: row[6]
        }));
        await connection.close();
        return orderItems;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
};

const addOrder = async (orderData, orderItemsData) => {
    const connection = await getConnection();
    try {
        const result = await connection.execute(
            "INSERT INTO Orders (customer_id, status, total_amount) VALUES (:customerId, :status, :totalAmount) RETURNING order_id INTO :orderId",
            {
                customerId: orderData.customerId,
                status: orderData.status,
                totalAmount: orderData.totalAmount,
                orderId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
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
                    unitPrice: item.unitPrice
                }
            );
        }

        await connection.commit();
        return { success: true, orderId: orderId };
    } catch (error) {
        await connection.rollback();
        console.error("Error adding order:", error.message);
        return { success: false, message: error.message };
    } finally {
        await connection.close();
    }
};

export default { getAllOrders, getOrderItems, addOrder };