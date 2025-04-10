import React from "react";
import axios from "axios";
import "./CustomerFeedbackAdd.css";
import { useNotification } from '../../context/notificationContext';

const ReviewPopup = ({ isOpen, onClose, onSubmit }) => {

  const  {showNotification} = useNotification()

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in to submit feedback.");
      return;
    }
  
    const review = {
      userId : userId,
      reviewer: e.target.reviewer.value.trim(),
      rating: parseInt(e.target.rating.value),
      text: e.target.text.value.trim(),
      date: new Date().toLocaleDateString(),
    };
  
    if (!review.reviewer || !review.rating || !review.text) {
      alert("Please fill out all fields before submitting.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/feedback", review);
      if (response.data.success) {
        showNotification("Feedback submitted successfully!", "success");
        onSubmit(review);
        onClose();
      } else {
        showNotification("Failed to submit feedback. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
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
            placeholder="Write your Feedback..."
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPopup;