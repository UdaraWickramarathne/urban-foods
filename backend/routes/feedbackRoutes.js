import express from "express";
import FeedbackController from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", (req, res) => FeedbackController.addFeedback(req, res));

router.get("/", (req, res) => FeedbackController.getAllFeedback(req, res));

router.put("/", (req, res) => FeedbackController.editFeedback(req, res));

router.delete("/", (req, res) => FeedbackController.deleteFeedback(req, res));

export default router;