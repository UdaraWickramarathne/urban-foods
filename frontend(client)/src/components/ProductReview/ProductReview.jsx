import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import './ProductReview.css';

const FeedbackPopup = ({ onClose, productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId'); // Get user ID from localStorage

    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      const reviewData = {
        productId,
        userId,
        title,
        comment,
        rating,
        date: new Date().toISOString(), // Add the current date
      };

      const response = await axios.post('http://localhost:5000/api/review', reviewData);

      if (response.data.success) {
        console.log('Review added successfully:', response.data.Review);
        onReviewAdded(response.data.Review); // Notify parent component about the new review
        onClose(); // Close the popup
      } else {
        console.error('Failed to add review:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Share Your Feedback</h2>

        <label>Rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={rating >= star ? 'star filled' : 'star'}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <label>Title</label>
        <input
          type="text"
          placeholder="Give your feedback a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Your Comment</label>
        <textarea
          placeholder="Tell us about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="button-row">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Submit Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;