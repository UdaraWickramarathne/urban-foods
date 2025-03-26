
import { getConnection } from "../db/dbConnection.js";
import Cart from "../models/cart.js";
import oracledb from "oracledb";

const getCartItems = async (userId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM cart WHERE user_id = :userId`,
      { userId }
    );
    return result.rows.map((row) => Cart.fromDbRow(row, result.metaData));
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
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return { success: false, message: "Error adding item to cart" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const removeFromCart = async (cartId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute("DELETE FROM cart WHERE cart_id = :cartId", { cartId });
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

const updateCartItem = async (cartId, quantity) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `UPDATE cart SET quantity = :quantity WHERE cart_id = :cartId`,
      { quantity, cartId }
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
