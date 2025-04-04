import FeedbackRepository from "../repositories/feedbackRepository.js";

class FeedbackController {
  async addFeedback(req, res) {
    console.log(req.body);
    try {
      const { reviewer, rating, text, date } = req.body;
      const userId = req.body.userId;

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      const feedbackData = { reviewer, rating, text, date, userId };
      const feedback = await FeedbackRepository.addFeedback(feedbackData);

      res.status(201).json({ success: true, message: "Feedback added successfully", feedback });
    } catch (error) {
      console.error("Error in addFeedback:", error);
      res.status(500).json({ success: false, message: "Error adding feedback", error });
    }
  }

  async getAllFeedback(req, res) {
    try {
      // Fetch feedback from MongoDB
      const feedbackList = await FeedbackRepository.getAllFeedback();

      // Extract unique userIds from feedback
      const userIds = [...new Set(feedbackList.map((feedback) => feedback.userId))];

      // Fetch customer details from OracleDB
      const customerDetails = await FeedbackRepository.getCustomerDetailsFromOracle(userIds);

      // Combine feedback with customer details
      const combinedFeedback = feedbackList.map((feedback) => {
        const customer = customerDetails[feedback.userId] || {
          name: "Unknown User",
          image: "src/images/default-user.png",
        };
        return {
          id: feedback._id,
          userId: feedback.userId,
          name: customer.name,
          image: customer.image,
          text: feedback.text,
          rating: feedback.rating,
        };
      });

      res.status(200).json({ success: true, feedback: combinedFeedback });
    } catch (error) {
      console.error("Error in getAllFeedback:", error);
      res.status(500).json({ success: false, message: "Error fetching feedback", error });
    }
  }
}

export default new FeedbackController();