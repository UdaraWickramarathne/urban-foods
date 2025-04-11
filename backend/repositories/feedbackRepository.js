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
      connection = await getConnection();

      if (!Array.isArray(userId)) {
        throw new Error("userId must be an array");
      }
  
      const sanitizedUserIds = userId
        .filter((id) => id !== undefined && id !== null)
        .map((id) => `'${String(id).replace(/'/g, "''")}'`)
        .join(",");
  
      if (!sanitizedUserIds) {
        throw new Error("No valid user IDs provided");
      }
  
      const query = `
        SELECT customer_id, FIRST_NAME, IMAGE_URL
        FROM customers
        WHERE customer_id IN (${sanitizedUserIds})
      `;
      const result = await connection.execute(query);

      const customerDetails = {};
      result.rows.forEach((row) => {
        customerDetails[row[0]] = {
          name: row[1],
          imageUrl: row[2],
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

  async editfeedback(feedbackId, feedbackData) {
  return await Feedback.updateMany(
    { _id: feedbackId },
    {
      $set: {
        rating: feedbackData.rating,
        title: feedbackData.title,
        comment: feedbackData.comment,
      },
    }
  );
}

  async deleteFeedback(feedbackId) {
    return await Feedback.deleteOne({ _id: feedbackId });
  }

  async getFeedbackByUserId(userId) {
    return await Feedback.find({ userId });
  }
}

export default new FeedbackRepository();