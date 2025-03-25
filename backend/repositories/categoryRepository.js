import { getConnection } from "../db/dbConnection.js";
import Category from "../models/category.js";

const addCategory = async (category) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `INSERT INTO categories (name, description) VALUES (:name, :description)`,
      {
        name: category.name,
        description: category.description,
      },
      { autoCommit: true }
    );

    return result;
  } catch (error) {
    console.error("Error adding category:", error.message);
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

const getAllCategories = async () => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT * FROM categories ORDER BY category_id`
    );
    const categories = result.rows.map((row) => Category.fromDbRow(row, result.metaData));
    return categories;
  } catch (error) {
    console.error("Error getting categories:", error.message);
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

const deleteCategory = async (categoryId) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `DELETE FROM categories WHERE category_id = :categoryId`,
      {
        categoryId,
      },
      { autoCommit: true }
    );
    return result;
  } catch (error) {
    console.error("Error deleting category:", error.message);
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

const updateCategory = async (categoryId, category) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `UPDATE categories SET name = :name, description = :description WHERE category_id = :categoryId`,
      {
        name: category.name,
        description: category.description,
        categoryId,
      },
      { autoCommit: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating category:", error.message);
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

export default { addCategory, getAllCategories, deleteCategory, updateCategory };
