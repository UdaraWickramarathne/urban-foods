import { getConnection } from "../db/dbConnection.js";
import Cart from "../models/cart.js";
import oracledb from "oracledb";

const getCartItems = async (userId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT c.product_id, c.quantity, p.name, p.image_url, p.price
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = :userId`,
      { userId }
    );
    return result.rows.map((row) => ({
      productId: row[0],
      quantity: row[1],
      name: row[2],
      imageUrl: row[3],
      price: row[4],
    }));
  } catch (error) {
    console.error("Error retrieving cart items:", error.message);
    return [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const addToCart = async (cartData) => {
  let connection;
  try {
    connection = await getConnection();
    const existingItem = await connection.execute(
      `SELECT * FROM cart WHERE product_id = :productId AND user_id = :userId`,
      { productId: cartData.productId, userId: cartData.userId }
    );
    if (existingItem.rows.length > 0) {
      await connection.execute(
        `UPDATE cart SET quantity = :quantity WHERE product_id = :productId AND user_id = :userId`,
        {
          quantity: cartData.quantity,
          productId: cartData.productId,
          userId: cartData.userId,
        }
      );
      await connection.commit();
      return { success: true, message: "Cart item updated successfully" };
    } else {
      await connection.execute(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES (:userId, :productId, :quantity)`,
        {
          userId: cartData.userId,
          productId: cartData.productId,
          quantity: cartData.quantity,
        },
        { autoCommit: true }
      );
      return { success: true, message: "Item added to cart successfully" };
    }
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return { success: false, message: "Error adding item to cart" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const removeFromCart = async (userId, productId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM cart WHERE product_id = :productId AND user_id = :userId`,
      { productId, userId }
    );
    await connection.commit();
    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    return { success: false, message: "Error removing item from cart" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const updateCartItem = async (userId, productId, quantity) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `UPDATE cart SET quantity = :quantity WHERE product_id = :productId AND user_id = :userId`,
      { quantity, productId, userId }
    );
    await connection.commit();
    return { success: true, message: "Cart item updated successfully" };
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    return { success: false, message: "Error updating cart item" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

export default { getCartItems, addToCart, removeFromCart, updateCartItem };
