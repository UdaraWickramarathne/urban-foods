import reviewRepository from "../repositories/reviewRepository.js";

class ReviewController {
  async addReview(req, res) {
    try {
      const { title, comment, rating, date, productId } = req.body;
      const userId = req.body.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }

      const reviewData = { title, comment, rating, date, userId, productId };
      const review = await reviewRepository.addReview(reviewData);

      res
        .status(201)
        .json({ success: true, message: "Review added successfully", review });
    } catch (error) {
      console.error("Error in addReview:", error);
      res
        .status(500)
        .json({ success: false, message: "Error adding review", error });
    }
  }

  async getAllReviews(req, res) {
    try {
      const { productId } = req.query;

      let reviewList;
      if (productId) {
        reviewList = await reviewRepository.getReviewsByProductId(productId);
      } else {
        reviewList = await reviewRepository.getAllReviews();
      }

      const userIds = [
        ...new Set(reviewList.map((review) => review.userId)),
      ].filter((id) => id !== undefined && id !== null);

      let customerDetails = {};
      if (userIds.length > 0) {
        customerDetails = await reviewRepository.getCustomerDetailsFromOracle(
          userIds
        );
      }

      const combinedReviews = reviewList.map((review) => {
        const customer = customerDetails[review.userId] || {
          name: "Unknown User",
          imageUrl: "default-user.png",
        };
        return {
          id: review._id,
          userId: review.userId,
          first_name: customer.first_name,
          image: customer.imageUrl,
          title: review.title,
          comment: review.comment,
          rating: review.rating,
          date: review.date,
        };
      });

      res.status(200).json({ success: true, reviews: combinedReviews });
    } catch (error) {
      console.error("Error in getAllReviews:", error);
      res
        .status(500)
        .json({ success: false, message: "Error fetching reviews", error });
    }
  }

  async editReview(req, res) {
    try {
      const { reviewId, title, comment, rating, userId } = req.body;

      const review = await reviewRepository.getReviewById(reviewId);
      if (!review) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found" });
      }

      if (review.userId !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Unauthorized to edit this review",
          });
      }

      const reviewData = { title, comment, rating };
      const updatedReview = await reviewRepository.editReview(
        reviewId,
        reviewData
      );

      res
        .status(200)
        .json({
          success: true,
          message: "Review updated successfully",
          updatedReview,
        });
    } catch (error) {
      console.error("Error in editReview:", error);
      res
        .status(500)
        .json({ success: false, message: "Error updating review", error });
    }
  }

  async deleteReview(req, res) {
    try {
      const { reviewId, userId } = req.body;

      const review = await reviewRepository.getReviewById(reviewId);
      if (!review) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found" });
      }

      if (review.userId !== userId) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Unauthorized to delete this review",
          });
      }

      await reviewRepository.deleteReview(reviewId);

      res
        .status(200)
        .json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error in deleteReview:", error);
      res
        .status(500)
        .json({ success: false, message: "Error deleting review", error });
    }
  }
  async getReviewById(req, res) {
    try {
      const { reviewId } = req.query;

      if (!reviewId) {
        return res
          .status(400)
          .json({ success: false, message: "Review ID is required" });
      }

      const review = await reviewRepository.getReviewById(reviewId);

      if (!review) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found" });
      }

      res.status(200).json({ success: true, review });
    } catch (error) {
      console.error("Error in getReviewById:", error);
      res
        .status(500)
        .json({ success: false, message: "Error fetching review", error });
    }
  }

  async getReviewByUserId(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }

      const reviews = await reviewRepository.getReviewByUserId(userId);

      res.status(200).json({ success: true, reviews });
    } catch (error) {
      console.error("Error in getReviewByUserId:", error);
      res
        .status(500)
        .json({ success: false, message: "Error fetching reviews", error });
    }
  }
}
export default new ReviewController();
