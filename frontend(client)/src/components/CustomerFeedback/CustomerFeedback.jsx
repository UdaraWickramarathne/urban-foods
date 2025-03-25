import React from "react";
import "./CustomerFeedback.css";

const ReviewPopup = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      reviewer: e.target.reviewer.value.trim(),
      rating: parseInt(e.target.rating.value),
      text: e.target.text.value.trim(),
      date: new Date().toLocaleDateString(),
    };

    // Ensure all fields are filled before submitting
    if (!review.reviewer || !review.rating || !review.text) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    onSubmit(review); // Pass the review data to the parent component
    onClose(); // Close the popup after submission
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Submit Your Review</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="reviewer"
            placeholder="Your Name"
            required
          />
          <select name="rating" required>
            <option value="">Rating</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
          <textarea
            name="text"
            placeholder="Write your review..."
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPopup;