import Review from "../models/review.js";
import { getConnection } from "../db/dbConnection.js";

class ReviewRepository {
  async addReview(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  }

  async getAllReviews() {
    return await Review.find();
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
          first_name: row[1],
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

  async editReview(reviewId, reviewData) {
    return await Review.updateMany(
        { _id: reviewId },
        { $set: {
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
        } }
        );
    }

    async deleteReview(reviewId) {
        return await Review.deleteMany({ _id: reviewId });
    }

    async getReviewById(reviewId) {
        return await Review.findById(reviewId);
    }
    async getReviewByUserId(userId) {
        return await Review.find({ userId: userId });
    }

    async getReviewsByProductId(productId) {
        return await Review.find({ productId });
      }
}
export default new ReviewRepository();
