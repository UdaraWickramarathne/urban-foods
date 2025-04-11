import FeedbackRepository from "../repositories/feedbackRepository.js";

class FeedbackController {
  async addFeedback(req, res) {
    console.log(req.body);
    try {
      const { title, comment, rating, date } = req.body;
      const userId = req.body.userId;

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      const feedbackData = {title, comment, rating, date, userId };
      const feedback = await FeedbackRepository.addFeedback(feedbackData);

      res.status(201).json({ success: true, message: "Feedback added successfully", feedback });
    } catch (error) {
      console.error("Error in addFeedback:", error);
      res.status(500).json({ success: false, message: "Error adding feedback", error });
    }
  }

  async getAllFeedback(req, res) {
    try {
      const { userId } = req.query;
  
      let feedbackList;
      if (userId) {
        feedbackList = await FeedbackRepository.getFeedbackByUserId(userId);
      } else {
        feedbackList = await FeedbackRepository.getAllFeedback();
      }
  
      const userIds = [...new Set(feedbackList.map((feedback) => feedback.userId))].filter(
        (id) => id !== undefined && id !== null
      );
  
      let customerDetails = {};
      if (userIds.length > 0) {
        customerDetails = await FeedbackRepository.getCustomerDetailsFromOracle(userIds);
      }
  
      const combinedFeedback = feedbackList.map((feedback) => {
        const customer = customerDetails[feedback.userId] || {
          name: "Unknown User",
          imageUrl: "default-user.png",
        };
        return {
          id: feedback._id,
          userId: feedback.userId,
          name: customer.name,
          image: customer.imageUrl,
          title: feedback.title,
          comment: feedback.comment,
          rating: feedback.rating,
          date: feedback.date,
        };
      });
  
      res.status(200).json({ success: true, feedback: combinedFeedback });
    } catch (error) {
      console.error("Error in getAllFeedback:", error);
      res.status(500).json({ success: false, message: "Error fetching feedback", error });
    }
  }

  async editFeedback(req, res) {
    try {
      const { feedbackId, feedbackData } = req.body;
      const updatedFeedback = await FeedbackRepository.editfeedback(feedbackId, feedbackData);

      res.status(200).json({ success: true, message: "Feedback updated successfully", updatedFeedback });
    } catch (error) {
      console.error("Error in editFeedback:", error);
      res.status(500).json({ success: false, message: "Error updating feedback", error });
    }
  }

  async deleteFeedback(req, res) {
    try {
      const { feedbackId } = req.body;
      await FeedbackRepository.deleteFeedback(feedbackId);

      res.status(200).json({ success: true, message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error in deleteFeedback:", error);
      res.status(500).json({ success: false, message: "Error deleting feedback", error });
    }
  }
}

export default new FeedbackController();