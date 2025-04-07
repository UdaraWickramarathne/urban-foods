import React, { useState } from 'react';
import './ProductReview.css';

const FeedbackPopup = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    // You can send this data to your backend
    console.log({ rating, title, comment });
    onClose();
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
