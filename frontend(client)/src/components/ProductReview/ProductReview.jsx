import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductReview.css';
import { useNotification } from '../../context/notificationContext';

const FeedbackPopup = ({ onClose, onReviewAdded, productId, review }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title);
      setComment(review.comment);
    }
  }, [review]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!title || !comment || rating === 0) {
      showNotification('Please fill all fields and provide a rating.', 'warning');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const date = new Date().toISOString().split('T')[0];

      const payload = {
        userId,
        productId,
        title,
        comment,
        rating,
        date,
      };

      let response;
      if (review) {
        payload.reviewId = review.id;
        response = await axios.put('http://localhost:5000/api/reviews', payload);
      } else {
        response = await axios.post('http://localhost:5000/api/reviews', payload);
      }

      if (response.data.success) {
        showNotification(
          review ? 'Review updated successfully!' : 'Review added successfully!',
          'success'
        );
        onReviewAdded(response.data.review);
        onClose();
      } else {
        showNotification('Failed to submit review!', 'error');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotification('An error occurred while submitting the review.', 'error');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{review ? 'Edit Your Review' : 'Share Your Feedback'}</h2>

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
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            {review ? 'Update Feedback' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;