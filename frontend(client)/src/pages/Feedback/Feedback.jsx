import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ rating: 0, title: '', comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchFeedbacks = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in to view your feedback.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/feedback?userId=${userId}`);
      if (response.data.success) {
        setFeedbacks(response.data.feedback);
      } else {
        console.error("Failed to fetch feedback:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewFeedback((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in to submit feedback.");
      return;
    }
  
    const feedback = {
      userId: userId,
      title: newFeedback.title.trim(),
      rating: newFeedback.rating,
      comment: newFeedback.comment.trim(),
      date: new Date().toLocaleDateString(),
    };
    
    if (!feedback.title || !feedback.rating || !feedback.comment) {
      alert("Please fill out all fields before submitting.");
      return;
    }
  
    try {
      if (editingId) {
        const response = await axios.put("http://localhost:5000/api/feedback", {
          feedbackId: editingId,
          feedbackData: feedback,
        });
        if (response.data.success) {
          setFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((fb) =>
              fb.id === editingId
                ? { ...fb, ...feedback, date: new Date().toISOString().split("T")[0] }
                : fb
            )
          );
          setEditingId(null);
        }
      } else {
        const response = await axios.post("http://localhost:5000/api/feedback", feedback);
        if (response.data.success) {
          fetchFeedbacks();
        }
      }
      setNewFeedback({ rating: 0, title: "", comment: "" });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  const handleEdit = (feedback) => {
    setNewFeedback({
      rating: feedback.rating,
      title: feedback.title,
      comment: feedback.comment,
    });
    setEditingId(feedback.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('http://localhost:5000/api/feedback', {
        data: { feedbackId: id },
      });
      if (response.data.success) {
        setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback.id !== id));
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewFeedback({ rating: 0, title: '', comment: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="feedback-container">
      <header className="feedback-header">
        <h1>Your Feedback</h1>
        <p>We value your opinion! Share your thoughts with us.</p>
        {!isFormOpen && (
          <button className="add-feedback-btn" onClick={() => setIsFormOpen(true)}>
            <FaPlus /> Add New Feedback
          </button>
        )}
      </header>

      {isFormOpen && (
        <div className="feedback-form-container">
          <form className="feedback-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Your Feedback' : 'Share Your Feedback'}</h2>

            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < newFeedback.rating ? 'star active' : 'star'}
                    onClick={() => handleRatingChange(index + 1)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newFeedback.title}
                onChange={handleInputChange}
                placeholder="Give your feedback a title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Comment</label>
              <textarea
                id="comment"
                name="comment"
                value={newFeedback.comment}
                onChange={handleInputChange}
                placeholder="Tell us about your experience..."
                rows="5"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {editingId ? 'Update Feedback' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="feedback-list">
        <h2>Your Previous Feedback</h2>
        {feedbacks.length === 0 ? (
          <div className="no-feedback">
            <p>You haven't submitted any feedback yet.</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div className="feedback-card" key={feedback.id}>
              <div className="feedback-header">
                <h3>{feedback.title}</h3>
                <div className="feedback-actions">
                  <button className="edit-btn" onClick={() => handleEdit(feedback)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(feedback.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="feedback-rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < feedback.rating ? 'star active' : 'star'}
                  />
                ))}
              </div>

              <p className="feedback-comment">{feedback.comment}</p>
              <p className="feedback-date">Submitted on: {feedback.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;