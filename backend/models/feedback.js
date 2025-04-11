import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  using: { type: String },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true },
});

const Feedback = mongoose.model("feedback", feedbackSchema);

export default Feedback;