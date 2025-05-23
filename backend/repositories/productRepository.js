import { getConnection } from "../db/dbConnection.js";
import Product from "../models/product.js";
import oracledb from "oracledb";

const getAllProducts = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT p.*, c.name as category_name FROM products p INNER JOIN categories c ON p.category_id = c.category_id`
    );
    const products = result.rows.map((row) =>
      Product.fromDbRow(row, result.metaData)
    );
    return { success: true, data: products };
  } catch (error) {
    console.error("Error retrieving products:", error.message);
    return { success: false, message: "Error retrieving products" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getProductById = async (productId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM products WHERE product_id = :productId`,
      { productId }
    );
    if (result.rows.length === 0) {
      return null;
    }
    const product = Product.fromDbRow(result.rows[0], result.metaData);
    return product;
  } catch (error) {
    console.error("Error retrieving product by ID:", error.message);
    return null;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const insertProduct = async (productData) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `INSERT INTO products (supplier_id, category_id, name, price, stock, image_url) 
       VALUES (:supplierId, :categoryId, :name, :price, :stock, :imageUrl) 
       RETURNING product_id INTO :productId`,
      {
        supplierId: productData.supplierId,
        categoryId: productData.categoryId,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        imageUrl: productData.imageUrl,
        productId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true } // Enable autoCommit to automatically commit the transaction
    );

    return { success: true, productId: result.outBinds.productId[0] };
  } catch (error) {
    console.error("Error inserting product:", error.message);
    return { success: false, message: "Error inserting product" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const deleteProduct = async (productId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      "DELETE FROM products WHERE product_id = :productId",
      {
        productId,
      }
    );
    if (result.rowsAffected === 0) {
      return { success: false, message: "Product not found" };
    }
    await connection.commit();
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return { success: false, message: "Error deleting product" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const updateProduct = async (productId, updatedData) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `UPDATE products SET 
        supplier_id = :supplierId, 
        category_id = :categoryId, 
        name = :name, 
        price = :price, 
        stock = :stock, 
        image_url = :imageUrl 
       WHERE product_id = :productId`,
      {
        supplierId: updatedData.supplierId,
        categoryId: updatedData.categoryId,
        name: updatedData.name,
        price: updatedData.price,
        stock: updatedData.stock,
        imageUrl: updatedData.imageUrl,
        productId,
      }
    );
    await connection.commit();
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("Error updating product:", error.message);
    return { success: false, message: "Error updating product" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const searchProducts = async (keyword) => {
  console.log("keyword", keyword);
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM products WHERE name LIKE :keyword`,
      { keyword: `%${keyword}%` }
    );
    const products = result.rows.map((row) =>
      Product.fromDbRow(row, result.metaData)
    );
    return products;
  } catch (error) {
    console.error("Error searching products:", error.message);
    return [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getProductsBySupplierId = async (supplierId) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM products WHERE supplier_id = :supplierId`,
      { supplierId }
    );
    const products = result.rows.map((row) =>
      Product.fromDbRow(row, result.metaData)
    );
    return products;
  } catch (error) {
    console.error("Error retrieving products by supplier ID:", error.message);
    return [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getTop10Products = async () => {
  let connection;
  try {
    connection = await getConnection();
    const sql = `
      DECLARE
        top_products SYS_REFCURSOR;
      BEGIN
        top_products := get_top_10_products();
        DBMS_SQL.RETURN_RESULT(top_products);
      END;
    `;

    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const resultSet = result.implicitResults[0];

    if (!resultSet) {
      return [];
    }

    const products = resultSet.map((row) => {
      return {
        productId: row.PRODUCT_ID,
        name: row.NAME,
        price: row.PRICE,
        stock: row.STOCK,
        imageUrl: row.IMAGE_URL,
        supplierId: row.SUPPLIER_ID,
        categoryId: row.CATEGORY_ID,
        categoryName: row.CATEGORY_NAME,
      };
    });

    return products;
  } catch (error) {
    console.error("Error fetching top 10 products:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getProductCount = async (categoryId = null) => {
  let connection;
  try {
    connection = await getConnection();

    // Build the SQL query to call the function
    const sql = `BEGIN :result := get_product_count(:categoryId); END;`;

    // Bind parameters
    const binds = {
      categoryId: categoryId,
      result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    };

    // Execute the function call
    const result = await connection.execute(sql, binds);

    // Return the count
    return { success: true, count: result.outBinds.result };
  } catch (error) {
    console.error("Error getting product count:", error.message);
    return { success: false, message: "Error getting product count" };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const isProductOutOfStock = async (productId, quantity) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT stock FROM products WHERE product_id = :productId`,
      { productId }
    );
    if (result.rows.length === 0) {
      return null;
    }
    const stock = result.rows[0][0];
    return stock < quantity;
  } catch (error) {
    log.error("Error checking product stock:", error.message);
    return null;
  }
};

export default {
  getAllProducts,
  getProductById,
  insertProduct,
  deleteProduct,
  updateProduct,
  searchProducts,
  getProductsBySupplierId,
  getTop10Products,
  getProductCount,
  isProductOutOfStock
};
