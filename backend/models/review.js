import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  using: { type: String },
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true },
});

const Review = mongoose.model("review", reviewSchema);

export default Review;