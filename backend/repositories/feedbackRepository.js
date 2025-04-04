import Feedback from "../models/feedback.js";
import { getConnection } from "../db/dbConnection.js";

class FeedbackRepository {
  async addFeedback(feedbackData) {
    const feedback = new Feedback(feedbackData);
    return await feedback.save();
  }

  async getAllFeedback() {
    return await Feedback.find();
  }

  async getCustomerDetailsFromOracle(userId) {
    let connection;
    try {
      const connection = await getConnection();
      const query = `
      SELECT customer_id, FIRST_NAME, IMAGE_URL
      FROM customers
      WHERE customer_id IN (${userId.map((id) => `'${id}'`).join(",")})
    `;
    const result = await connection.execute(query);

    // Map the results to an object for easy lookup
    const customerDetails = {};
    result.rows.forEach((row) => {
      customerDetails[row[0]] = {
        name: row[1],
        image: row[2] || "src/images/default-user.png", // Default image if null
      };
    });

    return customerDetails;
  } catch (error) {
    console.error("Error fetching customer details from OracleDB:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
}

export default new FeedbackRepository();